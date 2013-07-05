{
  'targets': [
    {
      'target_name': 'video',
      'include_dirs': [
      ],
      'sources': [
        'src/async_stacked_video.cpp',
        'src/common.cpp',
        'src/fixed_video.cpp',
		'src/module.cpp',
		'src/module.cpp',
		'src/utils.cpp',
        'src/video_encoder.cpp'
      ],
	  'defines': [
              '-D_FILE_OFFSET_BITS=64', 
			  '-D_LARGEFILE_SOURCE'
      ],			  
	  'conditions': [
        ['OS=="mac"', {
            'include_dirs': [
            ],
            'libraries': [
            	'/Library/Ogg',
				'/Library/TheoraDec',
				'/Library/TheoraEnc',
            ]
        }],
        ['OS=="linux"', {
        	'link_settings': {
         		'libraries': [
         			'-logg',
					'-theoradec',
					'-theoraenc',
         		]
					
        	}
        }]
      ]	  
    }
  ]
}