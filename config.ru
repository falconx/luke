require 'bundler'

Bundler.require(:default, :production)

require 'rack'

require 'rack/jekyll'

require 'rubygems'

run Rack::Jekyll.new

echo 'rack-jekyll' > .gems
