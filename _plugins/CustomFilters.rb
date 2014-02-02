module Jekyll
	module PadTextFilter
  		def pad_text(input)
    		input.to_s.rjust(3, '0')
  		end
  	end
end

Liquid::Template.register_filter(Jekyll::PadTextFilter)