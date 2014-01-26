#require 'bundler'
#Bundler.require(:default, :production)

require 'rack/all'
run Rack::Jekyll.new
