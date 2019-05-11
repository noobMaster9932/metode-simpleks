import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, CardHeader, Row, Col, Input, Button } from 'reactstrap'
import { MathEQ } from './utils/math-eq'
import { firstComponentType } from '../redux/standard-eq/reducer'
import { mainType } from '../redux/main/reducer'
class StandardEq extends Component {
  state = { focus: 0, show: false }
  onChange = (i, e) => {
    this.setState({ focus: i, show: false }, () => {
      this.props.onChange(i, e)
    })
  }
  submit = () => {
    const validatorNull = this.props.optimalEq.map(a => a.value).includes('')
    const validatorZero = this.props.optimalEq.map(a => a.value).includes(0)
    if (validatorNull || validatorZero) {
      this.props.warning(true, 'Input tidak valid, isi semua data dengan benar')
    } else {
      this.setState({ show: true })
      this.props.next()
    }
  }
  render() {
    const { isOpen, optimalEq } = this.props
    return (
      isOpen && (
        <Card className='mt-3'>
          <CardHeader>
            <strong>
              Bentuk Standar Persamaan Optimalisasi
              {this.state.show && '  --->>'}
            </strong>
            {this.state.show && (
              <small style={{ marginLeft: 15 }}>
                <MathEQ eq={`F (a, b, c ...) = ${generator(optimalEq)}`} />
              </small>
            )}
          </CardHeader>
          <CardBody>
            <Row>
              <Col className='mb-2'>
                <small>
                  Masukkan Koefisien dari persamaan yang akan di optimalisasi
                </small>
              </Col>
            </Row>
            <Row>
              {optimalEq.map(item => (
                <Col
                  key={Math.random()}
                  style={{
                    paddingLeft: item.key === 0 ? 15 : 3,
                    paddingRight: 3
                  }}
                >
                  <Input
                    type='number'
                    autoFocus={item.key === this.state.focus ? true : false}
                    style={{ width: '100%' }}
                    value={item.value}
                    onChange={e => this.onChange(item.key, e.target.value)}
                  />
                </Col>
              ))}
              <Col className='col-sm-2'>
                <Button
                  style={{ width: '100%' }}
                  onClick={this.submit}
                  outline
                  color='warning'
                >
                  <span>
                    <i className='mr-2'>Submit</i>
                    <img src={require('../assets/icons/done.svg')} alt='' />
                  </span>
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )
    )
  }
}
const mapStateToProps = state => ({ ...state.firstComponentReducer })
const mapDispatchToProps = d => ({
  onChange: (key, value) =>
    d({
      type: firstComponentType.changeMainEQ,
      payload: { key: key, value: value }
    }),
  warning: (status, message) =>
    d({ type: mainType.warningSet, status: status, message: message }),
  next: () => d({ type: firstComponentType.next })
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardEq)
const coef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const generator = arr => {
  let a = ''
  for (let i = 0; i < arr.length; i++) {
    a =
      i > 0
        ? a +
          (arr[i].value >= 0
            ? `+ ${Math.abs(arr[i].value)}`
            : `- ${Math.abs(arr[i].value)}`) +
          coef[i]
        : a + arr[i].value + coef[i]
  }
  return a
}