import { createLocales } from '@sulesky/core'
import { DatePicker } from './DatePicker'

export const TimePicker = createLocales(DatePicker, {
  
  'en-US': {
    title: 'Time Picker',
    settings: {
      'x-component-props': {
        clearText: 'Clear Text',
        disabledHours: 'Disbaled Hours',
        disabledMinutes: 'Disabled Minutes',
        disabledSeconds: 'Disabled Seconds',
        hideDisabledOptions: 'Hide Disabled Options',
        hourStep: 'Hour Step',
        minuteStep: 'Minute Step',
        secondStep: 'Second Step',
        use12Hours: 'Use 12-hour',
        inputReadOnly: 'Input ReadOnly',
        showNow: 'Show Now',
        format: 'Format'
}
}
}
})

export const TimeRangePicker = createLocales(TimePicker, {
  
  'en-US': {
    title: 'Time Range'
}
})
