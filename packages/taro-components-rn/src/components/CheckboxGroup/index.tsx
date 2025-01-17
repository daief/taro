/**
 * ✔ onChange(bindchange)
 *
 * @warn No support of props FOR, you must put checkbox below label straightly.
 */

import * as React from 'react'
import {
  View,
} from 'react-native'
import { noop } from '../../utils'
import { CheckboxGroupProps, EventOnChange, ValueProps } from './PropsType'

class _CheckboxGroup extends React.Component<CheckboxGroupProps> {
  values: ValueProps[] = []
  tmpIndex = 0

  getDataFromValues = (): ValueProps[] => {
    return this.values
      .filter((item) => item.checked)
      .map((item) => item.value)
  }

  toggleChange = (e: EventOnChange, index: number): void => {
    const { onChange = noop } = this.props
    this.values[index] = {
      value: e.value,
      checked: e.checked
    }
    onChange({
      detail: {
        value: this.getDataFromValues()
      }
    })
  }

  findAndAttachCb = (children: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(children).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (childTypeName === '_Checkbox') {
        const { value, disabled, checked, color } = child.props
        const index = this.tmpIndex++
        this.values[index] = { value, checked }
        return React.cloneElement(child, {
          onChange: (e: EventOnChange) => this.toggleChange(e, index),
          value,
          disabled,
          checked,
          color
        })
      } else {
        return React.cloneElement(child, { ...child.props }, this.findAndAttachCb(child.props.children))
      }
    })
  }

  render (): JSX.Element {
    const {
      children,
      style,
      _onGroupDataInitial = noop
    } = this.props

    this.tmpIndex = 0
    const mapChildren = this.findAndAttachCb(children)
    _onGroupDataInitial(this.getDataFromValues())

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _CheckboxGroup
