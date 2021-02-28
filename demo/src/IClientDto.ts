import * as Yup from 'yup'

export interface IClientDto {
  name: string
  email: string
  altEmail: string
  phone: string
  clientCode: string
}

export const Schema = Yup.object().shape({
  name: Yup.string().label('Name').required(),
  clientCode: Yup.string().label('Client Code').required(),
  email: Yup.string().label('Email').email(),
  altEmail: Yup.string().label('Alternate Email').email()
})
