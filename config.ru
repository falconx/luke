#require 'bundler'
require 'rack/all'
#require 'rack/jekyll'

#Bundler.require(:default, :production)

run Rack::Jekyll.new
