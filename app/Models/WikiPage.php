<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class WikiPage extends Model
{
    use HasFactory;

    protected $table = 'wikipages';

    protected $fillable = [
        'title',
        'wiki_slug',
        'content',
        'elements',
        'html_content',
        'status',
        'user_id'
    ];

    protected $casts = [
        'content' => 'array',
        'elements' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function content(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value)
        );
    }

    protected function elements(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value)
        );
    }

    // Alias for backward compatibility if needed
    public function getSlugAttribute()
    {
        return $this->wiki_slug;
    }

    // Helper method to generate HTML from elements
    public function generateHtml()
    {
        if (empty($this->elements)) {
            return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Empty Page - Wiki</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center justify-center">
    <div class="text-center p-8">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-file-alt text-gray-400 text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-700 mb-2">Empty Page</h1>
        <p class="text-gray-500 max-w-md mx-auto">This page doesn\'t have any content yet.</p>
    </div>
</body>
</html>';
        }

        return $this->convertElementsToHtml($this->elements);
    }

    // Convert elements to HTML with Tailwind CSS
    private function convertElementsToHtml($elements)
    {
        $htmlContent = '';
        
        foreach ($elements as $element) {
            // Get Tailwind classes from styles
            $tailwindClasses = $this->convertStylesToTailwind($element['styles'] ?? []);
            $styleString = $this->convertStylesToInline($element['styles'] ?? []);
            
            // Parse content data
            $contentData = [];
            if (isset($element['content']) && !empty($element['content'])) {
                if (is_string($element['content']) && 
                    (str_starts_with($element['content'], '{') || str_starts_with($element['content'], '['))) {
                    try {
                        $contentData = json_decode($element['content'], true);
                    } catch (\Exception $e) {
                        $contentData = ['text' => $element['content']];
                    }
                } else {
                    $contentData = ['text' => $element['content']];
                }
            }

            switch ($element['type'] ?? 'CONTAINER') {
                case 'HEADER':
                    $htmlContent .= '<h2 class="' . $tailwindClasses . ' font-bold mb-4 text-gray-800">' . 
                        htmlspecialchars($element['content'] ?? '') . '</h2>';
                    break;
                    
                case 'PARAGRAPH':
                    $htmlContent .= '<p class="' . $tailwindClasses . ' mb-6 leading-relaxed text-gray-600">' . 
                        nl2br(htmlspecialchars($element['content'] ?? '')) . '</p>';
                    break;
                    
                case 'BUTTON':
                    if (isset($element['href']) && $element['href']) {
                        $htmlContent .= '<a href="' . htmlspecialchars($element['href']) . 
                            '" class="' . $tailwindClasses . ' inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">' . 
                            htmlspecialchars($element['content'] ?? '') . '</a>';
                    } else {
                        $htmlContent .= '<button class="' . $tailwindClasses . ' inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer">' . 
                            htmlspecialchars($element['content'] ?? '') . '</button>';
                    }
                    break;
                    
                case 'IMAGE':
                    $src = $element['src'] ?? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop';
                    $alt = $element['alt'] ?? 'Image';
                    $htmlContent .= '<img src="' . htmlspecialchars($src) . 
                        '" alt="' . htmlspecialchars($alt) . 
                        '" class="' . $tailwindClasses . ' max-w-full h-auto rounded-lg shadow-lg object-cover" />';
                    break;
                    
                case 'CONTAINER':
                    $isHtml = isset($element['content']) && preg_match('/<[a-z][\s\S]*>/i', $element['content']);
                    if ($isHtml) {
                        $htmlContent .= '<div class="' . $tailwindClasses . ' rounded-lg border border-gray-200 p-6 bg-white/50">' . 
                            $element['content'] . '</div>';
                    } else {
                        $htmlContent .= '<div class="' . $tailwindClasses . ' rounded-lg border border-gray-200 p-6 bg-white/50 text-gray-700">' . 
                            htmlspecialchars($element['content'] ?? '') . '</div>';
                    }
                    break;
                    
                case 'TWO_COL':
                    $left = $contentData['left'] ?? 'Left Column Content';
                    $right = $contentData['right'] ?? 'Right Column Content';
                    $htmlContent .= '<div class="' . $tailwindClasses . ' grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">';
                    $htmlContent .= '<div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">' . 
                        htmlspecialchars($left) . '</div>';
                    $htmlContent .= '<div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">' . 
                        htmlspecialchars($right) . '</div>';
                    $htmlContent .= '</div>';
                    break;
                    
                case 'NAVBAR':
                    $brand = $contentData['brand'] ?? 'Brand';
                    $links = $contentData['links'] ?? [];
                    $buttonText = $contentData['buttonText'] ?? '';
                    $buttonHref = $contentData['buttonHref'] ?? '#';
                    $logoSrc = $contentData['logoSrc'] ?? '';
                    
                    $htmlContent .= '<nav class="' . $tailwindClasses . ' bg-white shadow-sm border-b border-gray-100">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8">';
                    $htmlContent .= '<div class="flex justify-between items-center h-16">';
                    
                    // Logo/Brand
                    $htmlContent .= '<div class="flex items-center space-x-3">';
                    if ($logoSrc) {
                        $htmlContent .= '<img src="' . htmlspecialchars($logoSrc) . '" alt="Logo" class="h-8 w-auto">';
                    }
                    $htmlContent .= '<span class="text-xl font-bold text-gray-900">' . htmlspecialchars($brand) . '</span>';
                    $htmlContent .= '</div>';
                    
                    // Desktop Menu
                    $htmlContent .= '<div class="hidden md:flex items-center space-x-8">';
                    foreach ($links as $link) {
                        $linkText = is_array($link) ? ($link['text'] ?? 'Link') : $link;
                        $linkHref = is_array($link) ? ($link['href'] ?? '#') : '#';
                        $htmlContent .= '<a href="' . htmlspecialchars($linkHref) . 
                            '" class="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">' . 
                            htmlspecialchars($linkText) . '</a>';
                    }
                    if ($buttonText) {
                        $htmlContent .= '<a href="' . htmlspecialchars($buttonHref) . 
                            '" class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200">' . 
                            htmlspecialchars($buttonText) . '</a>';
                    }
                    $htmlContent .= '</div>';
                    
                    // Mobile menu button
                    $htmlContent .= '<button class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Open menu">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>';
                    
                    $htmlContent .= '</div></div></nav>';
                    break;
                    
                case 'HERO':
                    $heroTitle = $contentData['title'] ?? 'Hero Title';
                    $subtitle = $contentData['subtitle'] ?? 'Hero subtitle text goes here...';
                    $cta = $contentData['cta'] ?? 'Get Started';
                    $ctaHref = $contentData['ctaHref'] ?? '#';
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' bg-gradient-to-br from-gray-50 to-white py-16 md:py-24 lg:py-32">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">';
                    $htmlContent .= '<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">' . 
                        htmlspecialchars($heroTitle) . '</h1>';
                    $htmlContent .= '<p class="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">' . 
                        htmlspecialchars($subtitle) . '</p>';
                    $htmlContent .= '<div class="flex flex-col sm:flex-row gap-4 justify-center">';
                    $htmlContent .= '<a href="' . htmlspecialchars($ctaHref) . 
                        '" class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">' . 
                        htmlspecialchars($cta) . '</a>';
                    $htmlContent .= '<a href="#learn-more" class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white hover:bg-gray-50 rounded-xl border-2 border-primary-600 shadow-sm hover:shadow transition-all duration-300">Learn More</a>';
                    $htmlContent .= '</div></div></section>';
                    break;
                    
                case 'FEATURES':
                    $features = is_array($contentData) ? $contentData : [];
                    if (empty($features)) {
                        $features = [
                            ['title' => 'Feature 1', 'desc' => 'Description for feature 1'],
                            ['title' => 'Feature 2', 'desc' => 'Description for feature 2'],
                            ['title' => 'Feature 3', 'desc' => 'Description for feature 3']
                        ];
                    }
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16 md:py-24">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">';
                    
                    foreach ($features as $index => $feature) {
                        $title = $feature['title'] ?? 'Feature ' . ($index + 1);
                        $desc = $feature['desc'] ?? 'Feature description';
                        $icon = $feature['icon'] ?? ($index + 1);
                        
                        $htmlContent .= '<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">';
                        $htmlContent .= '<div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6">' . 
                            $icon . '</div>';
                        $htmlContent .= '<h3 class="text-xl font-bold text-gray-900 mb-4">' . 
                            htmlspecialchars($title) . '</h3>';
                        $htmlContent .= '<p class="text-gray-600 leading-relaxed">' . 
                            htmlspecialchars($desc) . '</p>';
                        $htmlContent .= '</div>';
                    }
                    
                    $htmlContent .= '</div></div></section>';
                    break;
                    
                case 'GALLERY':
                    $images = $contentData['images'] ?? [1, 2, 3, 4, 5, 6];
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8">';
                    $htmlContent .= '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">';
                    
                    foreach ($images as $index => $img) {
                        $src = is_string($img) && filter_var($img, FILTER_VALIDATE_URL) ? $img : 
                               'https://images.unsplash.com/photo-15' . ($index + 1) . '1288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format';
                        $htmlContent .= '<div class="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer">';
                        $htmlContent .= '<img src="' . htmlspecialchars($src) . 
                            '" alt="Gallery image ' . ($index + 1) . 
                            '" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />';
                        $htmlContent .= '<div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">';
                        $htmlContent .= '<span class="text-white font-medium">Image ' . ($index + 1) . '</span>';
                        $htmlContent .= '</div></div>';
                    }
                    
                    $htmlContent .= '</div></div></section>';
                    break;
                    
                case 'PRODUCT_GRID':
                    $products = is_array($contentData) ? $contentData : [];
                    if (empty($products)) {
                        $products = [
                            ['name' => 'Product 1', 'price' => '$49', 'buttonText' => 'Add to Cart'],
                            ['name' => 'Product 2', 'price' => '$79', 'buttonText' => 'Add to Cart'],
                            ['name' => 'Product 3', 'price' => '$99', 'buttonText' => 'Add to Cart'],
                            ['name' => 'Product 4', 'price' => '$129', 'buttonText' => 'Add to Cart']
                        ];
                    }
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8">';
                    $htmlContent .= '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">';
                    
                    foreach ($products as $index => $product) {
                        $name = $product['name'] ?? 'Product ' . ($index + 1);
                        $price = $product['price'] ?? '$99';
                        $image = $product['image'] ?? 'https://images.unsplash.com/photo-15' . ($index + 2) . '1288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format';
                        $buttonText = $product['buttonText'] ?? 'Add to Cart';
                        $buttonHref = $product['buttonHref'] ?? '#';
                        
                        $htmlContent .= '<div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">';
                        $htmlContent .= '<div class="relative overflow-hidden h-56 bg-gray-100">';
                        $htmlContent .= '<img src="' . htmlspecialchars($image) . 
                            '" alt="' . htmlspecialchars($name) . 
                            '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />';
                        $htmlContent .= '<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-600">' . 
                            htmlspecialchars($price) . '</div>';
                        $htmlContent .= '</div>';
                        $htmlContent .= '<div class="p-6">';
                        $htmlContent .= '<h3 class="text-lg font-bold text-gray-900 mb-2">' . 
                            htmlspecialchars($name) . '</h3>';
                        $htmlContent .= '<div class="flex items-center justify-between mt-4">';
                        $htmlContent .= '<span class="text-2xl font-bold text-primary-600">' . 
                            htmlspecialchars($price) . '</span>';
                        $htmlContent .= '<a href="' . htmlspecialchars($buttonHref) . 
                            '" class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2">';
                        $htmlContent .= '<i class="fas fa-shopping-cart text-sm"></i>';
                        $htmlContent .= '<span>' . htmlspecialchars($buttonText) . '</span>';
                        $htmlContent .= '</a></div></div></div>';
                    }
                    
                    $htmlContent .= '</div></div></section>';
                    break;
                    
                case 'CONTACT_FORM':
                    $formTitle = $contentData['title'] ?? 'Contact Us';
                    $buttonText = $contentData['buttonText'] ?? 'Send Message';
                    $labels = $contentData['labels'] ?? [
                        'firstName' => 'First Name', 
                        'lastName' => 'Last Name', 
                        'email' => 'Email Address', 
                        'message' => 'Your Message'
                    ];
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16 md:py-24">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">';
                    $htmlContent .= '<div class="text-center mb-12">';
                    $htmlContent .= '<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">' . 
                        htmlspecialchars($formTitle) . '</h2>';
                    $htmlContent .= '<p class="text-gray-600 text-lg">We\'ll get back to you within 24 hours</p>';
                    $htmlContent .= '</div>';
                    
                    $htmlContent .= '<form class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">';
                    
                    // First Name
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-medium text-gray-700 mb-2">' . 
                        htmlspecialchars($labels['firstName'] ?? 'First Name') . '</label>';
                    $htmlContent .= '<input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="John" />';
                    $htmlContent .= '</div>';
                    
                    // Last Name
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-medium text-gray-700 mb-2">' . 
                        htmlspecialchars($labels['lastName'] ?? 'Last Name') . '</label>';
                    $htmlContent .= '<input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="Doe" />';
                    $htmlContent .= '</div>';
                    $htmlContent .= '</div>';
                    
                    // Email
                    $htmlContent .= '<div class="mb-6">';
                    $htmlContent .= '<label class="block text-sm font-medium text-gray-700 mb-2">' . 
                        htmlspecialchars($labels['email'] ?? 'Email') . '</label>';
                    $htmlContent .= '<input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="john@example.com" />';
                    $htmlContent .= '</div>';
                    
                    // Message
                    $htmlContent .= '<div class="mb-8">';
                    $htmlContent .= '<label class="block text-sm font-medium text-gray-700 mb-2">' . 
                        htmlspecialchars($labels['message'] ?? 'Message') . '</label>';
                    $htmlContent .= '<textarea rows="5" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white resize-none" placeholder="How can we help you?"></textarea>';
                    $htmlContent .= '</div>';
                    
                    // Submit button
                    $htmlContent .= '<button type="submit" class="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">';
                    $htmlContent .= '<i class="fas fa-paper-plane"></i>';
                    $htmlContent .= '<span>' . htmlspecialchars($buttonText) . '</span>';
                    $htmlContent .= '</button>';
                    
                    $htmlContent .= '</form></div></section>';
                    break;
                    
                case 'FOOTER':
                    $brand = $contentData['brand'] ?? 'My Website';
                    $copyright = $contentData['copyright'] ?? '© ' . date('Y') . ' ' . $brand . '. All rights reserved.';
                    $links = $contentData['links'] ?? [];
                    if (empty($links)) {
                        $links = [
                            ['title' => 'Product', 'items' => ['Features', 'Pricing', 'API']],
                            ['title' => 'Company', 'items' => ['About', 'Careers', 'Contact']],
                            ['title' => 'Legal', 'items' => ['Privacy', 'Terms', 'Cookies']]
                        ];
                    }
                    
                    $htmlContent .= '<footer class="' . $tailwindClasses . ' bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 pt-16 pb-8">';
                    $htmlContent .= '<div class="container mx-auto px-4 sm:px-6 lg:px-8">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-700">';
                    
                    // Brand column
                    $htmlContent .= '<div class="lg:col-span-2">';
                    $htmlContent .= '<div class="flex items-center gap-3 mb-6">';
                    $htmlContent .= '<div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">';
                    $htmlContent .= '<i class="fas fa-cube text-white"></i>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<span class="text-2xl font-bold text-white">' . htmlspecialchars($brand) . '</span>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<p class="text-gray-400 max-w-md leading-relaxed">Building amazing digital experiences. Empowering creators worldwide with intuitive tools.</p>';
                    $htmlContent .= '<div class="flex gap-4 mt-8">';
                    $htmlContent .= '<a href="#" class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"><i class="fab fa-twitter"></i></a>';
                    $htmlContent .= '<a href="#" class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"><i class="fab fa-facebook-f"></i></a>';
                    $htmlContent .= '<a href="#" class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"><i class="fab fa-linkedin-in"></i></a>';
                    $htmlContent .= '<a href="#" class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"><i class="fab fa-github"></i></a>';
                    $htmlContent .= '</div></div>';
                    
                    // Link columns
                    foreach ($links as $col) {
                        $colTitle = $col['title'] ?? 'Column';
                        $colItems = $col['items'] ?? [];
                        
                        $htmlContent .= '<div>';
                        $htmlContent .= '<h4 class="text-white font-bold text-lg mb-6">' . 
                            htmlspecialchars($colTitle) . '</h4>';
                        $htmlContent .= '<ul class="space-y-3">';
                        
                        foreach ($colItems as $item) {
                            $htmlContent .= '<li>';
                            $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">' . 
                                htmlspecialchars($item) . '</a>';
                            $htmlContent .= '</li>';
                        }
                        
                        $htmlContent .= '</ul></div>';
                    }
                    $htmlContent .= '</div>';
                    
                    // Bottom section
                    $htmlContent .= '<div class="pt-8 flex flex-col md:flex-row justify-between items-center">';
                    $htmlContent .= '<p class="text-gray-400 text-sm">' . htmlspecialchars($copyright) . '</p>';
                    $htmlContent .= '<div class="flex gap-6 mt-4 md:mt-0">';
                    $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>';
                    $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>';
                    $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>';
                    $htmlContent .= '</div></div></div></footer>';
                    break;
                    
                default:
                    $htmlContent .= '<div class="' . $tailwindClasses . ' p-4 rounded-lg border border-gray-200 bg-white">' . 
                        htmlspecialchars($element['content'] ?? '') . '</div>';
            }
        }

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($this->title) . ' - Wiki Page</title>
    <meta name="description" content="Generated with Ez Builder Wiki Page Editor">
    <meta name="generator" content="Ez Builder">
    <meta name="created" content="' . date('Y-m-d\TH:i:s\Z') . '">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        * {
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }
        
        /* Custom animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        
        /* Selection color */
        ::selection {
            background-color: rgba(59, 130, 246, 0.3);
            color: inherit;
        }
        
        /* Focus styles */
        :focus-visible {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
        
        /* Print styles */
        @media print {
            .no-print {
                display: none !important;
            }
            
            body {
                color: #000 !important;
                background: #fff !important;
            }
            
            a {
                color: #000 !important;
                text-decoration: underline !important;
            }
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-white text-gray-900 min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <!-- Page header -->
        <header class="mb-12 text-center animate-fade-in">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">' . htmlspecialchars($this->title) . '</h1>
            <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-6"></div>
            <p class="text-gray-600 max-w-2xl mx-auto">
                <i class="fas fa-calendar-alt mr-2"></i>
                Generated on ' . date('F j, Y \a\t g:i A') . '
            </p>
        </header>
        
        <!-- Main content -->
        <main class="space-y-12">
            ' . $htmlContent . '
        </main>
        
        <!-- Footer -->
        <footer class="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm no-print">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded flex items-center justify-center">
                        <i class="fas fa-cube text-white text-xs"></i>
                    </div>
                    <span>Generated with <strong>Ez Builder</strong> Wiki Page Editor</span>
                </div>
                <div class="flex gap-4">
                    <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
                        <i class="fas fa-print mr-1"></i> Print
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
                        <i class="fas fa-share-alt mr-1"></i> Share
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary-600 transition-colors">
                        <i class="fas fa-download mr-1"></i> Download
                    </a>
                </div>
            </div>
            <p class="mt-4 text-xs text-gray-400">
                Page ID: ' . htmlspecialchars($this->wiki_slug) . ' | 
                Last updated: ' . $this->updated_at->format('M d, Y') . '
            </p>
        </footer>
    </div>
    
    <!-- Back to top button -->
    <button onclick="window.scrollTo({top: 0, behavior: \'smooth\'})" 
            class="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center no-print z-50">
        <i class="fas fa-chevron-up"></i>
    </button>
    
    <!-- Scripts -->
    <script>
        // Add interactivity
        document.addEventListener(\'DOMContentLoaded\', function() {
            // Smooth scrolling for anchor links
            document.querySelectorAll(\'a[href^="#"]\').forEach(anchor => {
                anchor.addEventListener(\'click\', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute(\'href\');
                    if (targetId !== \'#\') {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: \'smooth\' });
                        }
                    }
                });
            });
            
            // Add animation to elements on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: \'0px 0px -50px 0px\'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(\'animate-fade-in\');
                    }
                });
            }, observerOptions);
            
            // Observe all main content sections
            document.querySelectorAll(\'main > *\').forEach(el => {
                observer.observe(el);
            });
            
            // Print button functionality
            document.querySelector(\'a[href="#"] i.fa-print\')?.closest(\'a\').addEventListener(\'click\', function(e) {
                e.preventDefault();
                window.print();
            });
            
            // Share button functionality
            document.querySelector(\'a[href="#"] i.fa-share-alt\')?.closest(\'a\').addEventListener(\'click\', function(e) {
                e.preventDefault();
                if (navigator.share) {
                    navigator.share({
                        title: \'' . htmlspecialchars($this->title) . '\',
                        text: \'Check out this page created with Ez Builder\',
                        url: window.location.href
                    });
                } else {
                    alert(\'Share URL: \' + window.location.href);
                }
            });
        });
        
        // Tailwind configuration
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: \'#eff6ff\',
                            100: \'#dbeafe\',
                            200: \'#bfdbfe\',
                            300: \'#93c5fd\',
                            400: \'#60a5fa\',
                            500: \'#3b82f6\',
                            600: \'#2563eb\',
                            700: \'#1d4ed8\',
                            800: \'#1e40af\',
                            900: \'#1e3a8a\',
                        }
                    },
                    animation: {
                        \'fade-in\': \'fadeIn 0.5s ease-out\',
                        \'float\': \'float 3s ease-in-out infinite\',
                    },
                    keyframes: {
                        float: {
                            \'0%, 100%\': { transform: \'translateY(0)\' },
                            \'50%\': { transform: \'translateY(-10px)\' }
                        }
                    }
                }
            }
        }
    </script>
</body>
</html>';
    }

    /**
     * Convert style object to Tailwind CSS classes
     */
    private function convertStylesToTailwind($styles)
    {
        if (empty($styles)) {
            return '';
        }

        $classes = [];
        
        // Background color mapping
        $bgColorMap = [
            '#ffffff' => 'bg-white',
            '#000000' => 'bg-black',
            '#f8fafc' => 'bg-gray-50',
            '#f1f5f9' => 'bg-gray-100',
            '#e2e8f0' => 'bg-gray-200',
            '#cbd5e1' => 'bg-gray-300',
            '#94a3b8' => 'bg-gray-400',
            '#64748b' => 'bg-gray-500',
            '#475569' => 'bg-gray-600',
            '#334155' => 'bg-gray-700',
            '#1e293b' => 'bg-gray-800',
            '#0f172a' => 'bg-gray-900',
            '#3b82f6' => 'bg-primary-500',
            '#2563eb' => 'bg-primary-600',
            '#1d4ed8' => 'bg-primary-700',
            '#1e40af' => 'bg-primary-800',
            '#1e3a8a' => 'bg-primary-900',
            '#f3f4f6' => 'bg-gray-100',
            '#e5e7eb' => 'bg-gray-200',
            '#d1d5db' => 'bg-gray-300',
            '#9ca3af' => 'bg-gray-400',
            '#6b7280' => 'bg-gray-500',
            '#4b5563' => 'bg-gray-600',
            '#374151' => 'bg-gray-700',
            '#1f2937' => 'bg-gray-800',
            '#111827' => 'bg-gray-900',
        ];

        // Text color mapping
        $textColorMap = [
            '#ffffff' => 'text-white',
            '#000000' => 'text-black',
            '#6b7280' => 'text-gray-500',
            '#4b5563' => 'text-gray-600',
            '#374151' => 'text-gray-700',
            '#1f2937' => 'text-gray-800',
            '#111827' => 'text-gray-900',
            '#3b82f6' => 'text-primary-500',
            '#2563eb' => 'text-primary-600',
            '#1d4ed8' => 'text-primary-700',
        ];

        // Process each style property
        foreach ($styles as $key => $value) {
            if (empty($value)) continue;

            switch ($key) {
                case 'backgroundColor':
                    $color = strtolower($value);
                    if (isset($bgColorMap[$color])) {
                        $classes[] = $bgColorMap[$color];
                    } elseif (preg_match('/^#[0-9A-F]{6}$/i', $color)) {
                        $classes[] = 'bg-[' . $color . ']';
                    }
                    break;

                case 'color':
                    $color = strtolower($value);
                    if (isset($textColorMap[$color])) {
                        $classes[] = $textColorMap[$color];
                    } elseif (preg_match('/^#[0-9A-F]{6}$/i', $color)) {
                        $classes[] = 'text-[' . $color . ']';
                    }
                    break;

                case 'padding':
                    $paddingMap = [
                        '0px' => 'p-0',
                        '4px' => 'p-1',
                        '8px' => 'p-2',
                        '12px' => 'p-3',
                        '16px' => 'p-4',
                        '20px' => 'p-5',
                        '24px' => 'p-6',
                        '32px' => 'p-8',
                        '40px' => 'p-10',
                        '48px' => 'p-12',
                        '64px' => 'p-16',
                        '80px' => 'p-20',
                        '96px' => 'p-24',
                    ];
                    if (isset($paddingMap[$value])) {
                        $classes[] = $paddingMap[$value];
                    } else {
                        $classes[] = 'p-[' . $value . ']';
                    }
                    break;

                case 'margin':
                    $marginMap = [
                        '0px' => 'm-0',
                        '4px' => 'm-1',
                        '8px' => 'm-2',
                        '12px' => 'm-3',
                        '16px' => 'm-4',
                        '20px' => 'm-5',
                        '24px' => 'm-6',
                        '32px' => 'm-8',
                        '40px' => 'm-10',
                        '48px' => 'm-12',
                        '64px' => 'm-16',
                    ];
                    if (isset($marginMap[$value])) {
                        $classes[] = $marginMap[$value];
                    } else {
                        $classes[] = 'm-[' . $value . ']';
                    }
                    break;

                case 'fontSize':
                    $fontSizeMap = [
                        '12px' => 'text-xs',
                        '14px' => 'text-sm',
                        '16px' => 'text-base',
                        '18px' => 'text-lg',
                        '20px' => 'text-xl',
                        '24px' => 'text-2xl',
                        '30px' => 'text-3xl',
                        '36px' => 'text-4xl',
                        '48px' => 'text-5xl',
                        '60px' => 'text-6xl',
                    ];
                    if (isset($fontSizeMap[$value])) {
                        $classes[] = $fontSizeMap[$value];
                    } else {
                        $classes[] = 'text-[' . $value . ']';
                    }
                    break;

                case 'fontWeight':
                    $fontWeightMap = [
                        '100' => 'font-thin',
                        '200' => 'font-extralight',
                        '300' => 'font-light',
                        '400' => 'font-normal',
                        '500' => 'font-medium',
                        '600' => 'font-semibold',
                        '700' => 'font-bold',
                        '800' => 'font-extrabold',
                        '900' => 'font-black',
                        'normal' => 'font-normal',
                        'bold' => 'font-bold',
                    ];
                    if (isset($fontWeightMap[$value])) {
                        $classes[] = $fontWeightMap[$value];
                    } else {
                        $classes[] = 'font-[' . $value . ']';
                    }
                    break;

                case 'textAlign':
                    $classes[] = 'text-' . $value;
                    break;

                case 'borderRadius':
                    $borderRadiusMap = [
                        '0px' => 'rounded-none',
                        '2px' => 'rounded-sm',
                        '4px' => 'rounded',
                        '6px' => 'rounded-md',
                        '8px' => 'rounded-lg',
                        '12px' => 'rounded-xl',
                        '16px' => 'rounded-2xl',
                        '24px' => 'rounded-3xl',
                        '9999px' => 'rounded-full',
                    ];
                    if (isset($borderRadiusMap[$value])) {
                        $classes[] = $borderRadiusMap[$value];
                    } else {
                        $classes[] = 'rounded-[' . $value . ']';
                    }
                    break;

                case 'width':
                    if ($value === '100%') {
                        $classes[] = 'w-full';
                    } elseif ($value === 'auto') {
                        $classes[] = 'w-auto';
                    } elseif (preg_match('/^\d+px$/', $value)) {
                        $classes[] = 'w-[' . $value . ']';
                    }
                    break;

                case 'height':
                    if ($value === '100%') {
                        $classes[] = 'h-full';
                    } elseif ($value === 'auto') {
                        $classes[] = 'h-auto';
                    } elseif (preg_match('/^\d+px$/', $value)) {
                        $classes[] = 'h-[' . $value . ']';
                    }
                    break;

                case 'boxShadow':
                    $shadowMap = [
                        'none' => 'shadow-none',
                        '0 1px 2px 0 rgb(0 0 0 / 0.05)' => 'shadow-sm',
                        '0 4px 6px -1px rgb(0 0 0 / 0.1)' => 'shadow-md',
                        '0 10px 15px -3px rgb(0 0 0 / 0.1)' => 'shadow-lg',
                        '0 20px 25px -5px rgb(0 0 0 / 0.1)' => 'shadow-xl',
                        '0 25px 50px -12px rgb(0 0 0 / 0.25)' => 'shadow-2xl',
                    ];
                    if (isset($shadowMap[$value])) {
                        $classes[] = $shadowMap[$value];
                    } else {
                        $classes[] = 'shadow-[' . $value . ']';
                    }
                    break;

                case 'borderWidth':
                    if ($value === '0px') {
                        $classes[] = 'border-0';
                    } else {
                        $classes[] = 'border-[' . $value . ']';
                    }
                    break;

                case 'borderColor':
                    $borderColorMap = [
                        '#e5e7eb' => 'border-gray-200',
                        '#d1d5db' => 'border-gray-300',
                        '#9ca3af' => 'border-gray-400',
                        '#6b7280' => 'border-gray-500',
                        '#4b5563' => 'border-gray-600',
                        '#3b82f6' => 'border-primary-500',
                        '#2563eb' => 'border-primary-600',
                    ];
                    $color = strtolower($value);
                    if (isset($borderColorMap[$color])) {
                        $classes[] = $borderColorMap[$color];
                    } elseif (preg_match('/^#[0-9A-F]{6}$/i', $color)) {
                        $classes[] = 'border-[' . $color . ']';
                    }
                    break;

                case 'gap':
                    $gapMap = [
                        '0px' => 'gap-0',
                        '4px' => 'gap-1',
                        '8px' => 'gap-2',
                        '12px' => 'gap-3',
                        '16px' => 'gap-4',
                        '20px' => 'gap-5',
                        '24px' => 'gap-6',
                        '32px' => 'gap-8',
                        '40px' => 'gap-10',
                    ];
                    if (isset($gapMap[$value])) {
                        $classes[] = $gapMap[$value];
                    } else {
                        $classes[] = 'gap-[' . $value . ']';
                    }
                    break;

                case 'justifyContent':
                    $justifyMap = [
                        'flex-start' => 'justify-start',
                        'center' => 'justify-center',
                        'flex-end' => 'justify-end',
                        'space-between' => 'justify-between',
                        'space-around' => 'justify-around',
                        'space-evenly' => 'justify-evenly',
                    ];
                    if (isset($justifyMap[$value])) {
                        $classes[] = $justifyMap[$value];
                    }
                    break;

                case 'alignItems':
                    $alignMap = [
                        'flex-start' => 'items-start',
                        'center' => 'items-center',
                        'flex-end' => 'items-end',
                        'stretch' => 'items-stretch',
                        'baseline' => 'items-baseline',
                    ];
                    if (isset($alignMap[$value])) {
                        $classes[] = $alignMap[$value];
                    }
                    break;

                case 'gridTemplateColumns':
                    if ($value === '1fr 1fr') {
                        $classes[] = 'grid-cols-2';
                    } elseif ($value === '1fr 1fr 1fr') {
                        $classes[] = 'grid-cols-3';
                    } elseif ($value === '1fr 1fr 1fr 1fr') {
                        $classes[] = 'grid-cols-4';
                    } else {
                        $classes[] = 'grid-cols-[' . $value . ']';
                    }
                    break;
            }
        }

        // Add default classes for certain element types
        if (in_array($styles['type'] ?? '', ['HEADER', 'HERO', 'FEATURES'])) {
            if (!in_array('font-bold', $classes)) {
                $classes[] = 'font-bold';
            }
        }

        if (in_array($styles['type'] ?? '', ['BUTTON'])) {
            if (!in_array('transition-all', $classes)) {
                $classes[] = 'transition-all duration-200';
            }
            if (!in_array('cursor-pointer', $classes)) {
                $classes[] = 'cursor-pointer';
            }
        }

        return implode(' ', array_unique($classes));
    }

    /**
     * Convert style object to inline CSS for fallback
     */
    private function convertStylesToInline($styles)
    {
        if (empty($styles)) {
            return '';
        }

        $inlineStyles = [];
        
        foreach ($styles as $key => $value) {
            if (empty($value)) continue;

            $cssKey = preg_replace('/([A-Z])/', '-$1', $key);
            $cssKey = strtolower($cssKey);
            
            // Skip type property as it's not a CSS property
            if ($cssKey === 'type') continue;
            
            $inlineStyles[] = $cssKey . ': ' . $value;
        }

        return implode('; ', $inlineStyles);
    }

    /**
     * Get the base Tailwind configuration for generated pages
     */
    public static function getTailwindConfig()
    {
        return [
            'colors' => [
                'primary' => [
                    50 => '#eff6ff',
                    100 => '#dbeafe',
                    200 => '#bfdbfe',
                    300 => '#93c5fd',
                    400 => '#60a5fa',
                    500 => '#3b82f6',
                    600 => '#2563eb',
                    700 => '#1d4ed8',
                    800 => '#1e40af',
                    900 => '#1e3a8a',
                ],
                'gray' => [
                    50 => '#f8fafc',
                    100 => '#f1f5f9',
                    200 => '#e2e8f0',
                    300 => '#cbd5e1',
                    400 => '#94a3b8',
                    500 => '#64748b',
                    600 => '#475569',
                    700 => '#334155',
                    800 => '#1e293b',
                    900 => '#0f172a',
                ]
            ],
            'fontFamily' => [
                'sans' => ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
            ],
            'animation' => [
                'fade-in' => 'fadeIn 0.5s ease-out',
                'float' => 'float 3s ease-in-out infinite',
            ]
        ];
    }

    /**
     * Generate a preview of the page with minimal styling
     */
    public function generatePreview()
    {
        if (empty($this->elements)) {
            return '<div class="p-8 text-center text-gray-500">
                <i class="fas fa-file-alt text-4xl mb-4"></i>
                <p>No content yet</p>
            </div>';
        }

        $preview = '<div class="space-y-4 p-4 bg-gray-50 rounded-lg">';
        
        foreach ($this->elements as $element) {
            $type = $element['type'] ?? 'UNKNOWN';
            $preview .= '<div class="p-3 bg-white rounded border border-gray-200 flex items-center gap-3">';
            $preview .= '<span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">' . $type . '</span>';
            
            if (isset($element['content']) && is_string($element['content'])) {
                $content = substr($element['content'], 0, 50);
                if (strlen($element['content']) > 50) {
                    $content .= '...';
                }
                $preview .= '<span class="text-gray-600 text-sm">' . htmlspecialchars($content) . '</span>';
            }
            
            $preview .= '</div>';
        }
        
        $preview .= '</div>';
        
        return $preview;
    }

    /**
     * Get page statistics
     */
    public function getPageStats()
    {
        $elements = $this->elements ?? [];
        $elementCount = count($elements);
        
        $wordCount = 0;
        $imageCount = 0;
        
        foreach ($elements as $element) {
            if (isset($element['content']) && is_string($element['content'])) {
                $wordCount += str_word_count(strip_tags($element['content']));
            }
            
            if (($element['type'] ?? '') === 'IMAGE') {
                $imageCount++;
            }
        }
        
        $htmlSize = $this->html_content ? strlen($this->html_content) : 0;
        
        return [
            'elements' => $elementCount,
            'words' => $wordCount,
            'images' => $imageCount,
            'html_size_kb' => round($htmlSize / 1024, 2),
            'last_updated' => $this->updated_at->diffForHumans(),
            'status' => $this->status,
            'is_empty' => $elementCount === 0,
        ];
    }
}