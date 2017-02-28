var verified_articles = {}

function applyLinkHoverAction() {
	$('a[onclick^=Linkshim]').filter('[class]').bind(
		'mouseover', 
		function() { 
			var url = $(this).attr('href')
			if (!(url in verified_articles)) {
				verified_articles[url] = retrieveArticleDate(url);
			}
		});
}

var observer = new MutationObserver(function (mutations, observer) {
	applyLinkHoverAction();
});

observer.observe($('[id^=topnews_main_stream_]').get(0), {
	subtree: true,
	attributes: true
});

function retrieveArticleDate(url) {
	var out = '';
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://archive.org/wayback/available?url=" + url + "&timestamp=19960512", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
		if (xhr.responseText != '{"archived_snapshots":{}}') {
			var resp = JSON.parse(xhr.responseText);
			resp['archived_snapshots']['closest']['timestamp'];
			date = moment(resp['archived_snapshots']['closest']['timestamp'], "YYYYMMDD").format('L');
			relative_date = moment(resp['archived_snapshots']['closest']['timestamp'], "YYYYMMDD").fromNow();
			out = url + " Date: " + date + " Relative Date: " + relative_date;
			//console.log(out);
			$('a[href="' + url + '"]').prev().find('.ellipsis').fadeIn().append('<span style="float: right; color: #04B431;">' + relative_date + '</span>').hide().fadeIn()
		}
	  }
	}
	xhr.send();
	return out;
}
