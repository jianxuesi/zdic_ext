import urllib2

def test():
    #debug
    handler=urllib2.HTTPHandler(debuglevel = 1)
    opener = urllib2.build_opener(handler)
    opener.addheaders = [
        ('User-agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'),
        ("Referer", "http://www.amazon.com/gp/dmusic/purchase/thankYou?ie=UTF8&amp;ASIN=B00CBUN4H8&amp;inPlaceOK=0&amp;js=1&amp;libraryAsinList=&amp;orderID=D01-4263937-4324748&amp;prereleasedTracksOrderId=&amp;a2z=mJbEWLWYzNap2R78Ji4m9LeRY4bCEX%2FUydGCnnRQbveIksQ54z8V8nWMgKpt5qZ299UNQXbEyy5rGb7EHiUUACJhpw2rGGCOc%2FBs2NHt2x%2FOv7NNosZ0lYFVBBuAz7WG"),
        ("Accept-Encoding", "gzip,deflate,sdch"),
        ("Accept-Language", "en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4"),
        ("Connection", "keep-alive"),
        ("Content-Length", "0"),
        ("Origin", "http://www.amazon.com"),
        ("X-Requested-With", "XMLHttpRequest"),
        ("Accept", "*/*"),
    ]
    urllib2.install_opener(opener)
    #request
    url = 'http://localhost:4750/purchase/A1HOKE71EUM2XU/D01-4263937-4324748'
    #req = urllib2.Request(url)
    f = urllib2.urlopen(url,'')
    response = f.read()
    print response

test()


