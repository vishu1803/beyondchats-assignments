<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'source_url',
        'is_generated',
        'original_article_id',
        'references',
    ];

    protected $casts = [
        'references' => 'array',
    ];

    public function original()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    public function generatedVersions()
    {
        return $this->hasMany(Article::class, 'original_article_id');
    }
}

