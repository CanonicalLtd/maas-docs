
# API authentication

MAAS's API uses [OAuth][oauth] as its authentication mechanism. There isn't a
third party involved (as in 3-legged OAuth) and so the process used is what's
commonly referred to as 0-legged OAuth: the consumer accesses protected
resources by submitting OAuth signed requests.

Note that some API endpoints support unauthenticated requests (i.e. anonymous
access). See the API documentation &lt;api&gt; for details.

# Examples

Here are two examples on how to perform an authenticated GET request to
retrieve the list of nodes. The &lt;key&gt;, &lt;secret&gt;,
&lt;consumer\_key&gt; tokens are the three elements that compose the API key
(API key = '&lt;consumer\_key&gt;:&lt;key&gt;:&lt;secret&gt;').

## Python

```python
import oauth.oauth as oauth
import httplib2
import uuid

def perform_API_request(site, uri, method, key, secret, consumer_key):
    resource_tok_string = "oauth_token_secret=%s&oauth_token=%s" % (
        secret, key)
    resource_token = oauth.OAuthToken.from_string(resource_tok_string)
    consumer_token = oauth.OAuthConsumer(consumer_key, "")

    oauth_request = oauth.OAuthRequest.from_consumer_and_token(
        consumer_token, token=resource_token, http_url=site,
        parameters={'oauth_nonce': uuid.uuid4().get_hex()})
    oauth_request.sign_request(
        oauth.OAuthSignatureMethod_PLAINTEXT(), consumer_token,
        resource_token)
    headers = oauth_request.to_header()
    url = "%s%s" % (site, uri)
    http = httplib2.Http()
    return http.request(url, method, body=None, headers=headers)

# API key = '<consumer_key>:<key>:<secret>'
response = perform_API_request(
    'http://server/MAAS/api/1.0', '/nodes/?op=list', 'GET', '<key>', '<secret>',
    '<consumer_key>')
```

## Ruby

```ruby
require 'oauth'
require 'oauth/signature/plaintext'

def perform_API_request(site, uri, key, secret, consumer_key)
    consumer = OAuth::Consumer.new(
        consumer_key, "",
        { :site => "http://localhost/MAAS/api/1.0",
          :scheme => :header, :signature_method => "PLAINTEXT"})
    access_token = OAuth::AccessToken.new(consumer, key, secret)
    return access_token.request(:get, "/nodes/?op=list")
end

# API key = "<consumer_key>:<key>:<secret>"
response = perform_API_request(
     "http://server/MAAS/api/1.0", "/nodes/?op=list", "<key>", "<secret>",
     "consumer_key>")
```

<!-- LINKS -->
[oauth]: http://en.wikipedia.org/wiki/OAuth
