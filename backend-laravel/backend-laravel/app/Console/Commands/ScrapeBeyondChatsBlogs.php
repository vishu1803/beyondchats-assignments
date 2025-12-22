<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;
use Illuminate\Support\Str;

class ScrapeBeyondChatsBlogs extends Command
{
    protected $signature = 'beyondchats:scrape-blogs {--limit=5}';
    protected $description = 'Scrape last page of BeyondChats blogs and store oldest articles';

    public function handle()
    {
        $client = new Client([
            'base_uri' => 'https://beyondchats.com',
            'timeout'  => 10,
        ]);

        // 1. Find last page (you’ll need to inspect pagination HTML in browser and update selectors)
        $listUrl = '/blogs/';
        $res = $client->get($listUrl);
        $html = (string) $res->getBody();
        $crawler = new Crawler($html);

        // Example: assume there is a pagination with links and last page is the max page number
        $pages = $crawler->filter('.pagination a')->each(function (Crawler $node) {
            return $node->text();
        });

        $lastPage = collect($pages)
            ->filter(fn($t) => is_numeric($t))
            ->max() ?? 1;

        $this->info("Detected last page: {$lastPage}");

        // 2. Fetch last page
        $resLast = $client->get("/blogs?page={$lastPage}");
        $htmlLast = (string) $resLast->getBody();
        $crawlerLast = new Crawler($htmlLast);

        // Update selectors after inspecting BeyondChats HTML
        $articles = $crawlerLast->filter('.blog-card')->each(function (Crawler $node) {
            $title = $node->filter('h2')->text('');
            $url = $node->filter('a')->attr('href');
            $excerpt = $node->filter('.excerpt')->count()
                ? $node->filter('.excerpt')->text('')
                : null;

            return compact('title', 'url', 'excerpt');
        });

        $articles = array_slice($articles, 0, (int) $this->option('limit'));

        foreach ($articles as $data) {
            if (!$data['title'] || !$data['url']) {
                continue;
            }

            $fullUrl = Str::startsWith($data['url'], 'http')
                ? $data['url']
                : 'https://beyondchats.com' . $data['url'];

            // Scrape detail page for main content (update selectors accordingly)
            $resDetail = $client->get($fullUrl);
            $detailHtml = (string) $resDetail->getBody();
            $detailCrawler = new Crawler($detailHtml);

            $contentNode = $detailCrawler->filter('.blog-content'); // adjust class
            $contentHtml = $contentNode->count() ? $contentNode->html() : null;

            $slug = Str::slug($data['title']);

            $article = Article::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $data['title'],
                    'excerpt' => $data['excerpt'] ?? null,
                    'content' => $contentHtml,
                    'source_url' => $fullUrl,
                    'is_generated' => false,
                    'original_article_id' => null,
                ]
            );

            $this->info("Saved article: {$article->title}");
        }

        return Command::SUCCESS;
    }
}
