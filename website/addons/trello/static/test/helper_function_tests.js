function numberOfLinks(text) {
        return $("<div/>").html(replaceURLWithHTMLLinks(text)).find('a').size();
    }

function kanbanicHelperTests(){
pavlov.specify("Kanbanic Helper Functions", function(){
    describe("Turning text URLs into HTML Links", function(){
        describe("Basic linking", function() {
//           These are all essentially taken from https://github.com/gregjacobs/Autolinker.js/blob/master/tests/AutolinkerSpec.js
//           with some tweaks for our specific settings
            it("should automatically link URLs in the form of http://osf.io/", function() {
                assert(numberOfLinks("http://osf.io/")).equals(1);
            });
            it("should automatically link URLs in the form of http://osf.io", function() {
                assert(numberOfLinks("http://osf.io")).equals(1);
            });
            it("should automatically link URLs in the form of google.com, prepending the http:// in this case", function() {
                var originalText = "Hey, it is google.com!";
                var newText = 'Hey, it is <a href="http://google.com" target="_blank">google.com</a>!';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of www.google.com", function() {
                var originalText = "Hey, it is www.google.com!";
                var newText = 'Hey, it is <a href="http://www.google.com" target="_blank">google.com</a>!';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of subdomain.google.com", function() {
                var originalText = "Hey, it is subdomain.google.com!";
                var newText = 'Hey, it is <a href="http://subdomain.google.com" target="_blank">subdomain.google.com</a>!';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of url.co.uk", function() {
                var originalText = "Hey, it is url.co.uk!";
                var newText = 'Hey, it is <a href="http://url.co.uk" target="_blank">url.co.uk</a>!';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of url.ru", function() {
                var originalText = "Hey, it is url.ru!";
                var newText = 'Hey, it is <a href="http://url.ru" target="_blank">url.ru</a>!';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link 'yahoo.xyz', but not 'sencha.etc'", function() {
                var originalText = "yahoo.xyz should be linked, sencha.etc should not";
                var newText = '<a href="http://yahoo.xyz" target="_blank">yahoo.xyz</a> should be linked, sencha.etc should not';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link 'a.museum', but not 'abc.123'", function() {
                var originalText = "a.museum should be linked, abc.123 should not";
                var newText = '<a href="http://a.museum" target="_blank">a.museum</a> should be linked, abc.123 should not';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of yahoo.com/path/to/file.html, handling the path", function() {
                var originalText = "Joe went to yahoo.com/path/to/file.html";
                var newText = 'Joe went to <a href="http://yahoo.com/path/to/file.html" target="_blank">yahoo.com/path/to/file.html</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of yahoo.com/path/to/file/deep/in/the/bowels/of/the/directory/hierarchy.html, shortening the path", function() {
                var originalText = "yahoo.com/path/to/file/deep/in/the/bowels/of/the/directory/hierarchy.html";
                var newText = '<a href="http://yahoo.com/path/to/file/deep/in/the/bowels/of/the/directory/hierarchy.html" target="_blank">yahoo.com/path/to/file/deep/in/the/bowels/of/the..</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of yahoo.com#index1, handling the hash", function() {
                var originalText = "Joe went to yahoo.com#index1";
                var newText = 'Joe went to <a href="http://yahoo.com#index1" target="_blank">yahoo.com#index1</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs in the form of 'yahoo.com.', without including the trailing period", function() {
                var originalText = "Joe went to yahoo.com.";
                var newText = 'Joe went to <a href="http://yahoo.com" target="_blank">yahoo.com</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should NOT automatically link URLs within HTML tags", function() {
                var originalText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p>';
                var newText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should automatically link URLs past the last HTML tag", function() {
                var originalText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p> and http://google.com';
                var newText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p> and <a href="http://google.com" target="_blank">google.com</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should NOT automatically link a URL found within the inner text of a pre-existing anchor tag", function() {
                var originalText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo.com</a></p> yesterday.';
                var newText = '<p>Joe went to <a href="http://www.yahoo.com">yahoo.com</a></p> yesterday.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should NOT automatically link a URL found within the inner text of a pre-existing anchor tag, but link others", function() {
                var originalText = '<p>Joe went to google.com, <a href="http://www.yahoo.com">yahoo.com</a>, and weather.com</p> yesterday.';
                var newText = '<p>Joe went to <a href="http://google.com" target="_blank">google.com</a>, <a href="http://www.yahoo.com">yahoo.com</a>, and <a href="http://weather.com" target="_blank">weather.com</a></p> yesterday.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should NOT automatically link an image tag with a URL inside it, inside an anchor tag", function() {
                var originalText = '<a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a>';
                var newText = '<a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should NOT automatically link an image tag with a URL inside it, inside an anchor tag, but match urls around the tags", function() {
                var originalText = 'google.com looks like <a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a> (at google.com)';
                var newText = '<a href="http://google.com" target="_blank">google.com</a> looks like <a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a> (at <a href="http://google.com" target="_blank">google.com</a>)';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
        });
        describe("Parenthesis handling",function() {
            it("should include parentheses in URLs", function() {
                var originalText = 'TLDs come from en.wikipedia.org/wiki/IANA_(disambiguation).';
                var newText = 'TLDs come from <a href="http://en.wikipedia.org/wiki/IANA_(disambiguation)" target="_blank">en.wikipedia.org/wiki/IANA_(disambiguation)</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
                originalText = 'MSDN has a great article at http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx.';
                newText = 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx" target="_blank">msdn.microsoft.com/en-us/library/aa752574(VS.85)..</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should include parentheses in URLs with query strings", function() {
                var originalText = "TLDs come from en.wikipedia.org/wiki?IANA_(disambiguation).";
                var newText = 'TLDs come from <a href="http://en.wikipedia.org/wiki?IANA_(disambiguation)" target="_blank">en.wikipedia.org/wiki?IANA_(disambiguation)</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
                originalText = "MSDN has a great article at http://msdn.microsoft.com/en-us/library?aa752574(VS.85).aspx.";
                newText = 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library?aa752574(VS.85).aspx" target="_blank">msdn.microsoft.com/en-us/library?aa752574(VS.85)..</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should include parentheses in URLs with hash anchors", function() {
                var originalText = "TLDs come from en.wikipedia.org/wiki#IANA_(disambiguation).";
                var newText = 'TLDs come from <a href="http://en.wikipedia.org/wiki#IANA_(disambiguation)" target="_blank">en.wikipedia.org/wiki#IANA_(disambiguation)</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
                originalText = "MSDN has a great article at http://msdn.microsoft.com/en-us/library#aa752574(VS.85).aspx.";
                newText = 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library#aa752574(VS.85).aspx" target="_blank">msdn.microsoft.com/en-us/library#aa752574(VS.85)..</a>.';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should include parentheses in URLs, when the URL is also in parenthesis itself", function() {
                var originalText = "TLDs come from (en.wikipedia.org/wiki/IANA_(disambiguation)).";
                var newText = 'TLDs come from (<a href="http://en.wikipedia.org/wiki/IANA_(disambiguation)" target="_blank">en.wikipedia.org/wiki/IANA_(disambiguation)</a>).';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
                originalText = "MSDN has a great article at (http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx).";
                newText = 'MSDN has a great article at (<a href="http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx" target="_blank">msdn.microsoft.com/en-us/library/aa752574(VS.85)..</a>).';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should not include a final closing paren in the URL, if it doesn't match an opening paren in the url", function() {
                var originalText = "Click here (google.com) for more details";
                var newText = 'Click here (<a href="http://google.com" target="_blank">google.com</a>) for more details';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should not include a final closing paren in the URL when a path exists", function() {
                var originalText = "Click here (google.com/abc) for more details";
                var newText = 'Click here (<a href="http://google.com/abc" target="_blank">google.com/abc</a>) for more details';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should not include a final closing paren in the URL when a query string exists", function() {
                var originalText = "Click here (google.com?abc=1) for more details";
                var newText = 'Click here (<a href="http://google.com?abc=1" target="_blank">google.com?abc=1</a>) for more details';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should not include a final closing paren in the URL when a hash anchor exists", function() {
                var originalText = "Click here (google.com#abc) for more details";
                var newText = 'Click here (<a href="http://google.com#abc" target="_blank">google.com#abc</a>) for more details';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });
            it("should include escaped parentheses in the URL", function() {
                var originalText = "Here's an example from CodingHorror: http://en.wikipedia.org/wiki/PC_Tools_%28Central_Point_Software%29";
                var newText = 'Here\'s an example from CodingHorror: <a href="http://en.wikipedia.org/wiki/PC_Tools_%28Central_Point_Software%29" target="_blank">en.wikipedia.org/wiki/PC_Tools_%28Central_Point_..</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });


        });
        describe("Email address linking", function() {
            it("should automatically link an email address which is the only text in the string", function() {
                var originalText = 'joe@joe.com';
                var newText = '<a href="mailto:joe@joe.com" target="_blank">joe@joe.com</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });

            it("should automatically link email addresses at the start of the string", function() {
                var originalText = 'joe@joe.com is Joe\'s email';
                var newText = '<a href="mailto:joe@joe.com" target="_blank">joe@joe.com</a> is Joe\'s email';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });

            it("should automatically link an email address in the middle of the string", function() {
                var originalText = "Joe's email is joe@joe.com because it is";
                var newText = 'Joe\'s email is <a href="mailto:joe@joe.com" target="_blank">joe@joe.com</a> because it is';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });

            it("should automatically link email addresses at the end of the string", function() {
                var originalText = "Joe's email is joe@joe.com";
                var newText = 'Joe\'s email is <a href="mailto:joe@joe.com" target="_blank">joe@joe.com</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });

            it("should automatically link email addresses with a period in the 'local part'", function() {
                var originalText = "Joe's email is joe.smith@joe.com";
                var newText = 'Joe\'s email is <a href="mailto:joe.smith@joe.com" target="_blank">joe.smith@joe.com</a>';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });

            it("should NOT automatically link any old word with an @ character in it", function() {
                var originalText = "Hi there@stuff";
                var newText = 'Hi there@stuff';
                assert(replaceURLWithHTMLLinks(originalText)).equals(newText);
            });


        });
    });
 });
}