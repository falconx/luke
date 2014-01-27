require 'bundler'
Bundler.require(:default, :production)

require 'yaml'
require 'rack/jekyll'
run Rack::Jekyll.new
