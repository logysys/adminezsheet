<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\FrontpageController;
use App\Http\Controllers\AdmindomainController;
use App\Http\Controllers\LoadframeController;
use App\Http\Controllers\TokenInfoController;
use App\Http\Controllers\UserlistController;
use App\Http\Controllers\PointPurchaseController;
use App\Http\Controllers\TokenTransactionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\IncentiveController;
use App\Http\Controllers\HandlePurchaseController;
use App\Http\Controllers\PriceHistoryController;
use App\Http\Controllers\SupplyAdjustmentController;
use App\Http\Controllers\EzFunnelController;
use App\Http\Controllers\PowerstringController;
use App\Http\Controllers\ReserveController;
use App\Http\Controllers\EmailDesignController;
use App\Http\Controllers\EmojimarkerController;
use App\Http\Controllers\DomainTransferController;
use App\Http\Controllers\HandleSellingDetailController;
use App\Http\Controllers\AdminPendingTransferController;
use App\Http\Controllers\AdminRefundTransferController;
use App\Http\Controllers\FunnelDefaultController;
use App\Http\Controllers\ReserveManagementController;
use App\Http\Controllers\IncentiveHistoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BeeTransferController;
use App\Http\Controllers\TooltipController;
use App\Http\Controllers\DefaultpageController;
use App\Http\Controllers\PromotionMessageController;
use App\Http\Controllers\WikiPageController;
use App\Http\Controllers\DomainTransferRuleController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AiframeController;
use App\Http\Controllers\AIHistoryController;
use App\Http\Controllers\AiSettingController;
use App\Http\Controllers\AITooltipController;
use App\Http\Controllers\EzFunnelLandingPageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\BioLinkExtractorController;
use App\Http\Controllers\CouponUsageController;
use App\Http\Controllers\HomeTooltipController;
use App\Http\Controllers\DivinationAdminController;
use App\Http\Controllers\NumerologyAdminController;
use App\Http\Controllers\SearchKeywordController;
use Illuminate\Foundation\Application;
use App\Models\EzFunnel;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return inertia('Auth/Login');
    });
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/incentives', [DashboardController::class, 'getIncentives'])->name('dashboard.incentives');
    Route::get('/dashboard/invoice/{invoiceNumber}', [DashboardController::class, 'showInvoice'])->name('dashboard.invoice.show');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Resources
    Route::resource('templates', TemplateController::class)->except(['show']);
    Route::resource('frontpages', FrontpageController::class);
	Route::resource('defaultpages', DefaultpageController::class);
    Route::resource('admindomains', AdmindomainController::class);
    Route::resource('loadframes', LoadframeController::class);
    Route::resource('ezfunnels', EzFunnelController::class);
	Route::resource('email-designs', EmailDesignController::class);
	Route::resource('emojimarkers', EmojimarkerController::class);
	Route::resource('coupons', CouponController::class);
	Route::resource('tooltips', TooltipController::class);
	Route::resource('promotion-messages', PromotionMessageController::class);
	Route::resource('faqs', FaqController::class);
	Route::resource('domain-transfer-rules', DomainTransferRuleController::class);
	Route::resource('promotions', PromotionController::class);
	Route::resource('aiframes', AiframeController::class);
	Route::resource('ezfunnellandingpage', EzFunnelLandingPageController::class);
	Route::resource('pages', PageController::class);
	Route::resource('search-keywords', SearchKeywordController::class);
	Route::post('/pages/{page}/duplicate', [PageController::class, 'duplicate'])->name('pages.duplicate');
	Route::post('/pages/bulk-destroy', [PageController::class, 'bulkDestroy'])->name('pages.bulk-destroy');
	Route::get('/ezfunnellandingpage/{ezfunnel}/edit-aiid', [EzFunnelLandingPageController::class, 'editAiid'])
    ->name('ezfunnellandingpage.edit-aiid');
Route::put('/ezfunnellandingpage/{ezfunnel}/update-aiid', [EzFunnelLandingPageController::class, 'updateAiid'])
    ->name('ezfunnellandingpage.update-aiid');
	// WikiPage Resource Routes
    Route::resource('wikipages', WikiPageController::class);
    Route::resource('ai-tooltips', AITooltipController::class);
    
    // AI History Routes
    Route::get('/ai-history', [AIHistoryController::class, 'index'])
		->name('ai-history.index');
	Route::get('/ai-history/{conversation}', [AIHistoryController::class, 'show'])
		->name('ai-history.show');
	Route::delete('/ai-history/{conversation}', [AIHistoryController::class, 'destroy'])
		->name('ai-history.destroy');
	Route::post('/ai-history/bulk-destroy', [AIHistoryController::class, 'bulkDestroy'])
		->name('ai-history.bulk-destroy');
	Route::patch('/ai-history/{conversation}/status', [AIHistoryController::class, 'updateStatus'])
		->name('ai-history.update-status');
	Route::get('/ai-history/export', [AIHistoryController::class, 'export'])
		->name('ai-history.export');
	Route::get('/ai-history/statistics', [AIHistoryController::class, 'statistics'])
		->name('ai-history.statistics');
	Route::get('/ai-history/{conversation}/messages', [AIHistoryController::class, 'getMessages'])
		->name('ai-history.messages');
	Route::get('/ai-settings', [AiSettingController::class, 'index'])->name('ai-settings.index');
	Route::post('/ai-settings/update', [AiSettingController::class, 'update'])->name('ai-settings.update');
    Route::patch('/ai-history/pin/{conversationId}', [AIHistoryController::class, 'pin'])->name('ai-history.pin');
	Route::patch('/ai-history/unpin/{conversationId}', [AIHistoryController::class, 'unpin'])->name('ai-history.unpin');
	Route::post('/ai-history/bulk-pin', [AIHistoryController::class, 'bulkPin'])->name('ai-history.bulk-pin');
	Route::post('/ai-history/bulk-unpin', [AIHistoryController::class, 'bulkUnpin'])->name('ai-history.bulk-unpin');
    Route::post('/ai-history/update-pinned-order', [AIHistoryController::class, 'updatePinnedOrder'])
        ->name('ai-history.update-pinned-order');
	
	// Message-level operations (if needed)
	Route::patch('/ai/message/{slug}/status', [AIHistoryController::class, 'updateMessageStatus'])
		->name('ai-history.update-message-status');
	Route::delete('/ai/message/{slug}', [AIHistoryController::class, 'deleteMessage'])
		->name('ai-history.delete-message');
		
    // Additional wikipage routes
    Route::match(['put', 'post'], '/wikipages/{wikipage}/autosave', [WikiPageController::class, 'autoSave'])->name('wikipages.autosave');
    Route::post('/wikipages/{wikipage}/duplicate', [WikiPageController::class, 'duplicate'])->name('wikipages.duplicate');
    
    // HTML-related routes
    Route::post('/wikipages/{wikipage}/regenerate-html', [WikiPageController::class, 'regenerateHtml'])->name('wikipages.regenerate.html');
    Route::post('/wikipages/regenerate-all-html', [WikiPageController::class, 'regenerateHtml'])->name('wikipages.regenerate.all');
    Route::get('/wikipages/{wikipage}/html', [WikiPageController::class, 'getHtml'])->name('wikipages.html');
    Route::get('/wikipages/{wikipage}/html-stats', [WikiPageController::class, 'getHtmlStats'])->name('wikipages.html.stats');
    
    // Export routes
    Route::get('/wikipages/{wikipage}/export', [WikiPageController::class, 'exportHtml'])->name('wikipages.export');
    
    
    // Admindomains custom routes
    Route::post('admindomains/change', [AdmindomainController::class, 'changeDays'])->name('admindomains.change');
    Route::post('admindomains/status', [AdmindomainController::class, 'changeStatus'])->name('admindomains.status');

    // Token Info
    Route::get('/token-info', [TokenInfoController::class, 'index'])->name('token-info.index');
    Route::put('/token-info/{tokenInfo}', [TokenInfoController::class, 'update'])->name('token-info.update');
    
	Route::get('/funnel-default', [FunnelDefaultController::class, 'edit'])->name('funnel-default.edit');
	Route::match(['put', 'post'], '/funnel-default', [FunnelDefaultController::class, 'update'])->name('funnel-default.update');
	
	// Funnel UI Routes
	Route::get('/funnel-ui', [FunnelDefaultController::class, 'editUI'])->name('funnel-ui.edit');
	Route::put('/funnel-ui', [FunnelDefaultController::class, 'updateUI'])->name('funnel-ui.update');

	// Funnel Logo Routes
	Route::get('/funnel-logo', [FunnelDefaultController::class, 'editLogo'])->name('funnel-logo.edit');
	Route::post('/funnel-logo', [FunnelDefaultController::class, 'updateLogo'])->name('funnel-logo.update');

	// Funnel SEO Routes
	Route::get('/funnel-seo', [FunnelDefaultController::class, 'editSeo'])->name('funnel-seo.edit');
	Route::put('/funnel-seo/update', [FunnelDefaultController::class, 'updateSeo'])->name('funnel-seo.update');

    // User Balances
    Route::get('/userlist', [UserlistController::class, 'index'])->name('userlist.index');
    
	// Point Purchases
    Route::get('/point-purchases', [PointPurchaseController::class, 'index'])->name('point-purchases.index');
	Route::get('/invoices/{invoice_number}', [PointPurchaseController::class, 'show'])->name('point-purchases.show');
	
    // Token Transactions
    Route::get('/token-transactions', [TokenTransactionController::class, 'index'])->name('token-transactions.index');
    
	//handle purchase
	Route::get('/handle-purchases', [HandlePurchaseController::class, 'index'])->name('handle-purchases.index');
	Route::get('/invoices-handle/{invoiceNumber}', [InvoiceController::class, 'show'])->name('invoices.show');
	
    // Incentives
    Route::get('/incentives', [IncentiveController::class, 'index'])->name('incentives.index');
    Route::get('/incentives/create', [IncentiveController::class, 'create'])->name('incentives.create');
    Route::post('/incentives', [IncentiveController::class, 'store'])->name('incentives.store');
    Route::get('/incentives/{incentive}/edit', [IncentiveController::class, 'edit'])->name('incentives.edit');
    Route::put('/incentives/{incentive}', [IncentiveController::class, 'update'])->name('incentives.update');
    
	Route::get('/incentive-history', [IncentiveHistoryController::class, 'index'])
    ->name('incentive-history.index');
	Route::get('/incentive-history/invoice/{invoiceNumber}', [IncentiveHistoryController::class, 'showInvoice'])
    ->name('incentive-history.invoice');
	
    // Price History
    Route::get('/price-history', [PriceHistoryController::class, 'index'])->name('price-history.index');
    Route::get('/price-history/create', [PriceHistoryController::class, 'create'])->name('price-history.create');
    Route::post('/price-history', [PriceHistoryController::class, 'store'])->name('price-history.store');
    
    // Supply Adjustments
    Route::get('/supply-adjustments', [SupplyAdjustmentController::class, 'index'])->name('supply-adjustments.index');
    Route::get('/supply-adjustments/create', [SupplyAdjustmentController::class, 'create'])->name('supply-adjustments.create');
    Route::post('/supply-adjustments', [SupplyAdjustmentController::class, 'store'])->name('supply-adjustments.store');
	
	Route::resource('powerstrings', PowerstringController::class);
	
	Route::resource('reserves', ReserveController::class);
	Route::get('/reserves/{reserve}/edit', [ReserveController::class, 'edit'])->name('reserves.edit');
	
	Route::resource('domain-transfers', DomainTransferController::class)->only(['index', 'store']);
    Route::post('/domain-transfers/complete/{token}', [DomainTransferController::class, 'completeTransfer'])
        ->name('domain-transfers.complete');
	Route::get('/funnels/all', function() {
    return EzFunnel::with('user')->get();
	})->name('funnels.all');
	
	Route::get('/handle-sales', [HandleSellingDetailController::class, 'index'])
        ->name('handle-sales.index');
    
    // If you need additional routes for the admin sales history:
    Route::get('/handle-sales/{id}', [HandleSellingDetailController::class, 'show'])
        ->name('handle-sales.show');
	Route::get('/invoices-sellhandle/{invoiceNumber}', [HandleSellingDetailController::class, 'showHandleSellInvoice'])->name('invoices-sellhandle.show');
	
	Route::get('/pending-transfers', [AdminPendingTransferController::class, 'index'])
        ->name('pending-transfers.index');
    
    Route::post('/pending-transfers/{transfer}/force-complete', [AdminPendingTransferController::class, 'forceComplete'])
        ->name('pending-transfers.force-complete');
		
	Route::get('/refund-transfers', [AdminRefundTransferController::class, 'index'])->name('refund-transfers.index');
	Route::get('/refundinvoicebuyer/{invoiceNumber}', [AdminRefundTransferController::class, 'showRefundInvoicebuyer'])
         ->name('refund-transfers.invoice.buyer');
         
    Route::get('/refundinvoiceseller/{invoiceNumber}', [AdminRefundTransferController::class, 'showRefundInvoiceseller'])
         ->name('refund-transfers.invoice.seller');
		 
	Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
	Route::post('/settings/change', [SettingController::class, 'change'])->name('setting.change');
		 
	// Reserve management routes
	Route::prefix('reserve')->group(function () {
		Route::get('/dashboard', [ReserveManagementController::class, 'dashboard'])->name('reserve.dashboard');
		Route::post('/reserve', [ReserveManagementController::class, 'reservePoints'])->name('reserve.reserve');
		Route::post('/release', [ReserveManagementController::class, 'releasePoints'])->name('reserve.release');
		Route::post('/transfer', [ReserveManagementController::class, 'transferFromReserve'])->name('reserve.transfer');
		Route::get('/history', [ReserveManagementController::class, 'transactionHistory'])->name('reserve.history');
		Route::get('/invoice/{invoice}', [ReserveManagementController::class, 'show'])
		->name('invoice.show');
		Route::get('/invoice-show/{invoice}', [ReserveManagementController::class, 'showinvoice'])
		->name('showinvoice.show');
	});
	
	Route::get('/bee-transfers', [BeeTransferController::class, 'index'])->name('bee-transfers.index');
	Route::get('/bee-transfers/{transactionHash}', [BeeTransferController::class, 'show'])->name('bee-transfers.show');
	
	Route::prefix('bio-link-extractor')->group(function () {
			Route::get('/', [BioLinkExtractorController::class, 'index'])->name('bio-link-extractor.index');
			Route::post('/extract-user', [BioLinkExtractorController::class, 'extractUser'])->name('bio-link-extractor.extract-user');
			Route::post('/extract-platform', [BioLinkExtractorController::class, 'extractPlatform'])->name('bio-link-extractor.extract-platform');
			Route::get('/users', [BioLinkExtractorController::class, 'getUsers'])->name('bio-link-extractor.users');
			Route::get('/users/{userId}/links', [BioLinkExtractorController::class, 'getUserLinks'])->name('bio-link-extractor.user-links');
			Route::get('/export', [BioLinkExtractorController::class, 'export'])->name('bio-link-extractor.export');
		});
		
	Route::resource('coupon-usages', CouponUsageController::class)->only(['index', 'destroy']);
	Route::get('coupon-usages/statistics', [CouponUsageController::class, 'statistics'])->name('coupon-usages.statistics');
	Route::post('coupon-usages/bulk-destroy', [CouponUsageController::class, 'bulkDestroy'])->name('coupon-usages.bulk-destroy');
	Route::get('coupon-usages/export', [CouponUsageController::class, 'export'])->name('coupon-usages.export');
	Route::get('coupon-usages/coupon/{coupon}/statistics', [CouponUsageController::class, 'couponStatistics'])->name('coupon-usages.coupon-statistics');
	
	Route::resource('hometooltips', HomeTooltipController::class);
	Route::post('hometooltips/bulk-destroy', [HomeTooltipController::class, 'bulkDestroy'])->name('hometooltips.bulk-destroy');
	Route::post('hometooltips/clear-cache', [HomeTooltipController::class, 'clearCache'])->name('hometooltips.clear-cache');

	Route::prefix('divination')->group(function () {
    Route::get('/', [DivinationAdminController::class, 'index'])->name('divination.index');
    Route::get('/export', [DivinationAdminController::class, 'export'])->name('divination.export');
    Route::post('/bulk-destroy', [DivinationAdminController::class, 'bulkDestroy'])->name('divination.bulk-destroy');
    Route::get('/dashboard-stats', [DivinationAdminController::class, 'dashboardStats'])->name('divination.dashboard-stats');
    Route::get('/{divinationRecord}', [DivinationAdminController::class, 'show'])->name('divination.show');
    Route::get('/{divinationRecord}/edit', [DivinationAdminController::class, 'edit'])->name('divination.edit');
    Route::put('/{divinationRecord}', [DivinationAdminController::class, 'update'])->name('divination.update');
    Route::delete('/{divinationRecord}', [DivinationAdminController::class, 'destroy'])->name('divination.destroy');
	});
	
	Route::prefix('numerology')->name('numerology.')->group(function () {
		Route::get('/', [NumerologyAdminController::class, 'index'])->name('index');
		Route::get('/export', [NumerologyAdminController::class, 'export'])->name('export');
		Route::get('/dashboard-stats', [NumerologyAdminController::class, 'dashboardStats'])->name('dashboard-stats');
		Route::delete('/clear-all', [NumerologyAdminController::class, 'clearAll'])->name('clear-all');
		Route::post('/bulk-destroy', [NumerologyAdminController::class, 'bulkDestroy'])->name('bulk-destroy');
		Route::get('/{numerologySearch}', [NumerologyAdminController::class, 'show'])->name('show');
		Route::delete('/{numerologySearch}', [NumerologyAdminController::class, 'destroy'])->name('destroy');
	});
	
});

Route::get('/p/{slug}', [WikiPageController::class, 'show'])->name('wikipages.show.public');
Route::get('/wikipages/{wiki_slug}', [WikiPageController::class, 'show'])->name('wikipages.show');
Route::get('/wikipages/{wiki_slug}/preview', [WikiPageController::class, 'preview'])->name('wikipages.preview');

require __DIR__.'/auth.php';