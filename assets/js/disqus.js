/* * * This script suposes that the given variables exist and are globals
var disqus_shortname  = 'augustopascuttisblog'; // required: replace example with your forum shortname
var disqus_identifier = "{{ page.id | replace:'/','-' }}";
var disqus_url        = "http://blog.augustopascutti.com{{ page.url }}";
* * */

var dsq               = {};
var dsq_container     = undefined;
var disqus_shortname  = 'respectphp';
var disqus_identifier = '';

// Reloads the comment discussion
var Disqus = function(identifier) {
	// Inserts the DIV element for the comment thread
	if (!dsq_container) {
		dsq_container    = document.createElement('div');
		dsq_container.id = 'disqus_thread';
		document.getElementById('content').appendChild(dsq_container);
		// Append the event listeners on the sections
		sections = document.getElementById('sections');
		for (s=0; s<sections.childNodes.length;s++) {
			section = sections.childNodes[s];
			if (section.nodeType !== 1) { continue; }
			for (a=0; a<section.childNodes.length; a++) {
				anchor = section.childNodes[a];
				if (anchor.nodeType !== 1) { continue; }
				nodes        = anchor.href.split('#');
				anchor.dsqId = nodes.pop();
				console.log('Adding DISQUS event for: '+anchor.dsqId);
				addEvent(anchor, 'click', function() { Disqus(this.dsqId); console.log('Event catch for: ', this.dsqId); });
			}
		}
	}

	disqus_identifier       = identifier;
	dsq                     = {};
	dsq_container.innerHTML = '';

	(function() {
    dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
};