import { createLocales } from '@sulesky/core'

export const DatePicker = {
  
  'en-US': {
    title: 'DatePicker',
    settings: {
      'x-component-props': {
        disabledDate: {
          title: 'Disabled Date',
          tooltip: 'Format (currentDate: moment) => boolean'
},
        disabledTime: {
          title: 'Disabled Time',
          tooltip: 'Format (currentDate: moment) => boolean'
},
        inputReadOnly: 'Input ReadOnly',
        format: 'Format',
        picker: {
          title: 'Picker Type',
          dataSource: ['Time', 'Date', 'Month', 'Year', 'Quarter', 'Decade']
},
        showNow: 'Show Now',
        showTime: 'Show Time',
        showToday: 'Show Today'
}
}
}
}

export const DateRangePicker = createLocales(DatePicker, {
  
  'en-US': {
    title: 'DateRange'
}
})
