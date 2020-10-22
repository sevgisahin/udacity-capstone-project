import { apiEndpoint } from '../config'
import { MenuItem } from '../types/MenuItem';
import { CreateMenuItemRequest } from '../types/CreateMenuItemRequest';
import Axios from 'axios'
import { UpdateMenuItemRequest } from '../types/UpdateMenuItemRequest';

export async function getMenuItems(idToken: string): Promise<MenuItem[]> {
  console.log('Fetching menuItems')

  const response = await Axios.get(`${apiEndpoint}/menuitems`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('MenuItems:', response.data)
  return response.data.items
}

export async function createMenuItem(
  idToken: string,
  newMenuItem: CreateMenuItemRequest
): Promise<MenuItem> {
  const response = await Axios.post(`${apiEndpoint}/menuitems`,  JSON.stringify(newMenuItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchMenuItem(
  idToken: string,
  menuItemId: string,
  updatedMenuItem: UpdateMenuItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/menuitems/${menuItemId}`, JSON.stringify(updatedMenuItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMenuItem(
  idToken: string,
  menuItemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/menuitems/${menuItemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  menuItemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/menuitems/${menuItemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
