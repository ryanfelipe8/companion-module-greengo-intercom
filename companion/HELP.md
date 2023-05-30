### Green-GO Intercom OSC Remote

This module currently enables you to remotely control the channels 1 - 4 of a user or device with the commands talk, call, cue, listen, and level. In addition you have access to things like the main and PGM level, the isolate mode and the gain level of the user's input.

Please visit [the documentation](https://companion.greengo.digital) to get more information about this Companion module.

##### Included Actions

| Action             | What it does                                                           |
| :----------------- | :--------------------------------------------------------------------- |
| Set Channel Talk   | Control the talk state of a channel (cycles)                           |
| Send Channel Call  | Control the call state of a channel                                    |
| Send Channel Cue   | Control the cue state of a channel (cycles)                            |
| Set Channel Listen | Control the listen state (mute channel output) of a channel (cycles)   |
| Set Channel Level  | Control the output level of a channel (cycles)                         |
| Set PGM Level      | Control the output level of the program audio special channel (cycles) |
| Set Main Level     | Control the main output level of the device (cycles)                   |
| Set Input Gain     | Control the input gain of the device's active input (cycles)           |
| Set Isolate State  | Control the state of the isolate function (cycles)                     |
| Identify Device    | Call the device's identfy function to let its status lights blink      |

##### Included Feedbacks

| Feedback             | What it does                                                           |
| :------------------- | :--------------------------------------------------------------------- |
| Check Channel Talk   | React to the current talk state of a channel                           |
| Check Channel Call   | React to the current call state of a channel                           |
| Check Channel Cue    | React to the current cue state of a channel                            |
| Check Channel Listen | React to the current listen state of a channel (muted/unmuted)         |
| Check Channel Level  | React to the current output level of a channel                         |
| Check Channel VOX    | React to the current vox state of a channel (receiving audio)          |
| Check PGM Level      | React to the current output level of the program audio special channel |
| Check Main Level     | React to the current output level of the device                        |
| Check Input Gain     | React to the current gain level of the device's active input           |
| Check Isolate State  | React to the current isolate state of the device                       |
| Online Heartbeat     | A device online state that gets refreshed every 3 seconds              |
