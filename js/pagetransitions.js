var PageTransitions = (function () {

	var $main = $('#pt-main'),
		$pages = $main.children('div.pt-page'),
		$iterate = $('#iterateEffects'),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
		// support css animations
		support = Modernizr.cssanimations;

	function init() {

		$pages.each(function () {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class'));
		});

		$pages.eq(current).addClass('pt-page-current');

		$('#dl-menu').dlmenu({
			animationClasses: { in: 'dl-animate-in-2', out: 'dl-animate-out-2' },
			onLinkClick: function (el, ev) {
				ev.preventDefault();
				nextPage(el.data('animation'));
			}
		});

		$iterate.on('click', function () {
			if (isAnimating) {
				return false;
			}
			if (animcursor > 67) {
				animcursor = 1;
			}
			nextPage(animcursor);
			++animcursor;
			if (animcursor > 2) {
				animcursor = 1;
			}
		});

	}

	function nextPage(animation) {

		if (isAnimating) {
			return false;
		}

		isAnimating = true;

		var $currPage = $pages.eq(current);

		if (current < pagesCount - 1) {
			++current;
		}
		else {
			current = 0;
		}

		var $nextPage = $pages.eq(current).addClass('pt-page-current'),
			outClass = '', inClass = '';

		switch (animation) {

			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 3:
				outClass = 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 4:
				outClass = 'pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 5:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 6:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 7:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 8:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 9:
				outClass = 'pt-page-moveToLeftFade';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 10:
				outClass = 'pt-page-moveToRightFade';
				inClass = 'pt-page-moveFromLeftFade';
				break;

		}

		$currPage.addClass(outClass).on(animEndEventName, function () {
			$currPage.off(animEndEventName);
			endCurrPage = true;
			if (endNextPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		$nextPage.addClass(inClass).on(animEndEventName, function () {
			$nextPage.off(animEndEventName);
			endNextPage = true;
			if (endCurrPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		if (!support) {
			onEndAnimation($currPage, $nextPage);
		}

	}

	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
		isAnimating = false;
	}

	function resetPage($outpage, $inpage) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
	}

	init();

	return { init: init };

})();