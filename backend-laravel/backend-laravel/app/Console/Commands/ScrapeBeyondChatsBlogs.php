<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Article;

class ScrapeBeyondChatsBlogs extends Command
{
    protected $signature = 'beyondchats:scrape-blogs {--limit=5}';
    protected $description = 'Scrape last page of BeyondChats blogs and store oldest articles';

    public function handle()
    {
        $client = new Client();

        // Step 1: Get first page just to detect last page count
        $response = $client->get('https://beyondchats.com/wp-json/wp/v2/posts?per_page=10&orderby=date');
        
        $lastPage = $response->getHeader('X-WP-TotalPages')[0] ?? 1;

        $this->info("Detected Last Page: $lastPage");

        // Step 2: Fetch last page (oldest posts live here)
        $lastPageResponse = $client->get("https://beyondchats.com/wp-json/wp/v2/posts?per_page=10&page={$lastPage}&orderby=date&order=asc");

        $posts = json_decode($lastPageResponse->getBody(), true);

        // Step 3: Take first 5 oldest
        $posts = array_slice($posts, 0, 5);

        foreach ($posts as $post) {

            Article::updateOrCreate(
                ['slug' => $post['slug']],
                [
                    'title' => $post['title']['rendered'],
                    'excerpt' => $post['excerpt']['rendered'] ?? null,
                    'content' => $post['content']['rendered'] ?? null,
                    'source_url' => $post['link'],
                    'is_generated' => false,
                    'original_article_id' => null,
                ]
            );

            $this->info("Saved: " . $post['title']['rendered']);
        }

        $this->info("Completed Successfully 🎉");

        return Command::SUCCESS;
    }
}
