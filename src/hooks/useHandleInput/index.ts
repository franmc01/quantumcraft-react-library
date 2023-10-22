import React, { ChangeEvent } from 'react'

export const useHandleInput = () => {
  const [value, setValue] = React.useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }


  return {
    value,
    handleChange,
  }
}
