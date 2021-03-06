import React from 'react'
import { shallow } from 'enzyme' // eslint-disable-line import/no-extraneous-dependencies
import toJson from 'enzyme-to-json' // eslint-disable-line import/no-extraneous-dependencies

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Form from '../Form'
import { messageMap, validators } from '../../validation'


/* eslint-disable react/self-closing-comp */

describe('<Form> (non-mui input)', () => {
  const wrapper = shallow(
    <Form>
      <input type="text" />
    </Form>
  )

  it('should render', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})

describe('<Form> (no props)', () => {
  const validations = { name: [{ code: 'isAlpha', message: 'invalid' }] }
  const wrapper = shallow(
    <Form
      onSubmit={jest.fn()}
      validations={validations}
    >
      <TextField
        label="Name"
        type="text"
        name="name"
        value="123!"
        required
        data-validators="isAlpha"
      />
      <Button variant="raised" type="reset">Reset</Button>
      <Button variant="raised" type="submit">Submit</Button>
    </Form>
  )

  it('should render', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should have submit button enabled', () => {
    expect(wrapper.instance().props.disableSubmitButtonOnError).toEqual(true)
  })
})

describe('<Form> (all props)', () => {
  validators.isBorat = value => value === 'borat'
  const customMessageMap = Object.assign(messageMap, {
    isBorat: 'NAAAAAT! You can only write "borat" lol',
  })
  const validation = {
    messageMap: customMessageMap,
    requiredValidatorName: false,
    validators,
  }
  const validations = { name: [{ code: 'isAlpha', message: 'invalid' }] }

  const wrapper = shallow(
    <Form
      autoComplete="on"
      disableSubmitButtonOnError={false}
      onValuesChange={jest.fn()}
      onSubmit={jest.fn()}
      validation={validation}
      validations={validations}
    >
      {'fill out the form!'}
      <TextField
        label="Name"
        type="text"
        name="name"
        value="123"
        data-validators="isRequired,isBorat"
      />
      <div>
        <Checkbox checked={false} name="foo" value="bar" />
        <span>FooBar</span>
        <FormControlLabel
          control={<Checkbox checked={false} name="love" value="yes" />}
          label="I love love"
        />
        <React.Fragment></React.Fragment>
      </div>
      <FormControl required>
        <InputLabel>Age</InputLabel>
        <Select value="" name="age">
          <MenuItem value=""><em>Please select your age ...</em></MenuItem>
          <MenuItem value={10}>Teens</MenuItem>
          <MenuItem value={20}>Twenties</MenuItem>
          <MenuItem value={30}>Thirties</MenuItem>
          <MenuItem value="40+">Fourties +</MenuItem>
        </Select>
      </FormControl>
      <Button variant="raised" type="submit">Submit</Button>
    </Form>
  )

  it('should render', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('should have set validation', () => {
    expect(wrapper.instance().validation).toHaveProperty('messageMap')
  })

  it('should set state', () => {
    expect(wrapper.state()).toMatchObject({
      disableSubmitButton: false,
      fields: {},
    })
  })

  it('should have 2 children', () => {
    expect(wrapper.children()).toHaveLength(5)
  })

  it('should handle submit event', () => {
    const { onSubmit } = wrapper.instance().props
    const event = new Event('submit')
    wrapper.simulate('submit', event)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should have submit button disabled', () => {
    expect(wrapper.instance().props.disableSubmitButtonOnError).toEqual(false)
    expect(wrapper.state('disableSubmitButton')).toEqual(false)
  })
})
