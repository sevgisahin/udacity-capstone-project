import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMenuItem, deleteMenuItem, getMenuItems, patchMenuItem } from '../api/menuitems-api'
import Auth from '../auth/Auth'
import { MenuItem } from '../types/MenuItem'

interface MenuItemsProps {
  auth: Auth
  history: History
}

interface MenuItemsState {
  menuItems: MenuItem[]
  newMenuItemName: string
  newType: string
  newIngredient: string
  loadingMenuItems: boolean
}

export class MenuItems extends React.PureComponent<MenuItemsProps, MenuItemsState> {
  state: MenuItemsState = {
    menuItems: [],
    newMenuItemName: '',
    newType: '',
    newIngredient: '',
    loadingMenuItems: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMenuItemName: event.target.value })
  }

  handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newType: event.target.value })
  }

  handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newIngredient: event.target.value })
  }

  onEditButtonClick = (menuItemId: string) => {
    this.props.history.push(`/menuitems/${menuItemId}/edit`)
  }

  onMenuItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newMenuItem = await createMenuItem(this.props.auth.getIdToken(), {
        name: this.state.newMenuItemName,
        itemType: this.state.newType,
        ingredient: this.state.newIngredient
      })
      this.setState({
        menuItems: [...this.state.menuItems, newMenuItem],
        newMenuItemName: '',
        newType: '',
        newIngredient: ''
      })
    } catch {
      alert('MenuItem creation failed')
    }
  }

  onMenuItemDelete = async (menuItemId: string) => {
    try {
      await deleteMenuItem(this.props.auth.getIdToken(), menuItemId)
      this.setState({
        menuItems: this.state.menuItems.filter(menuItem => menuItem.menuItemId != menuItemId)
      })
    } catch {
      alert('MenuItem deletion failed')
    }
  }

  onMenuItemCheck = async (pos: number) => {
    try {
      const menuItem = this.state.menuItems[pos]
      await patchMenuItem(this.props.auth.getIdToken(), menuItem.menuItemId, {
        name: menuItem.name,
        ingredient: menuItem.ingredient,
        finished: !menuItem.finished
      })
      this.setState({
        menuItems: update(this.state.menuItems, {
          [pos]: { finished: { $set: !menuItem.finished } }
        })
      })
    } catch {
      alert('MenuItem deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const menuItems = await getMenuItems(this.props.auth.getIdToken())
      this.setState({
        menuItems,
        loadingMenuItems: false
      })
    } catch (e) {
      alert(`Failed to fetch menuItems: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Menu Items</Header>

        {this.renderCreateMenuItemInput()}

        {this.renderMenuItems()}
      </div>
    )
  }

  renderCreateMenuItemInput() {
    return (
      <Grid columns='three' divided>
      <Grid.Row>
        <Grid.Column width={8}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add New Item to the Menu',
              onClick: this.onMenuItemCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Name of the food..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Input
            placeholder="Type of the food..."
            onChange={this.handleTypeChange}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Input
            placeholder="Ingredent of the food..."
            onChange={this.handleIngredientChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider/>
        </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }

  renderMenuItems() {
    if (this.state.loadingMenuItems) {
      return this.renderLoading()
    }

    return this.renderMenuItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading MenuItems
        </Loader>
      </Grid.Row>
    )
  }

  renderMenuItemsList() {
    return (
      <Grid padded>
        {this.state.menuItems.map((menuItem, pos) => {
          return (
            <Grid.Row key={menuItem.menuItemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onMenuItemCheck(pos)}
                  checked={menuItem.finished}
                />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {menuItem.name}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {menuItem.itemType}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {menuItem.ingredient}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {menuItem.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(menuItem.menuItemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMenuItemDelete(menuItem.menuItemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {menuItem.attachmentUrl && (
                <Image src={menuItem.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
