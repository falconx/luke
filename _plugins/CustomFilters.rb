module Jekyll
	module PadTextFilter
  		def pad_text(input, max)
    		input.to_s.rjust(max, '0')
  		end
  	end
end

Liquid::Template.register_filter(Jekyll::PadTextFilter)