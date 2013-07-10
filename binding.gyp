{
  'targets': [
    {
      'target_name': 'video',
      'sources': [
	'src/common.cpp',
        'src/async_stacked_video.cpp',
        'src/fixed_video.cpp',
	'src/module.cpp',
	'src/utils.cpp',
	'src/stacked_video.cpp',
        'src/video_encoder.cpp'
      ],
      'cflags!': [ '-fno-exceptions','-Wunused-variable' ],
      'cflags_cc!': [ '-fno-exceptions','-Wunused-variable' ],



      'defines': [
          '_FILE_OFFSET_BITS=64', 
	  '_LARGEFILE_SOURCE'
      ],			  
      'conditions': [
        ['OS=="mac"', {
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
                                '-ltheoradec',
                                '-ltheoraenc',
                        ]
 
                }
        }]
      ]	  
    }
  ]
}
