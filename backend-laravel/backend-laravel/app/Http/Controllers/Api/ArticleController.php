<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::with('generatedVersions')->orderByDesc('created_at')->paginate(10);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'slug' => 'nullable|string|unique:articles,slug',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'source_url' => 'nullable|url',
            'is_generated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        }

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    public function show(Article $article)
    {
        $article->load('generatedVersions', 'original');
        return $article;
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'slug' => 'sometimes|string|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'source_url' => 'nullable|url',
            'is_generated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
        ]);

        $article->update($data);
        return $article;
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(null, 204);
    }

    public function latest()
    {
        $article = Article::where('is_generated', false)
            ->orderByDesc('created_at')
            ->firstOrFail();

        $article->load('generatedVersions');
        return $article;
    }
}
