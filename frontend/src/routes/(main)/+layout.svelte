<script lang="ts">
	import Menu from "../../components/molecule/menu/Menu.svelte"
	import MenuTitle from "../../components/molecule/menu/MenuTitle.svelte"
	import MenuItem from "../../components/molecule/menu/MenuItem.svelte"
	import MenuItemContainer from "../../components/molecule/menu/MenuItemContainer.svelte"
	import { page } from "$app/stores"
	import MenuDivider from "../../components/molecule/menu/MenuDivider.svelte"
    import Container from "../../components/molecule/Container.svelte"
	import Appbar from "../../components/molecule/appbar/AppBar.svelte"
	import Button from "../../components/atoms/Button.svelte"


    let hide = false
    let handleClick = () => hide = !hide

</script>

<div class="main">
	<Menu hide={hide}>
        <MenuItemContainer>
            <h1>D&B</h1>
        </MenuItemContainer>

        <MenuDivider />
        <MenuTitle text="📚 Menu" />
        <MenuDivider />

        <MenuItem href="/about" icon="📒" text="About" active={$page.url.pathname == "/about"} />
        <MenuItem href="/home" icon="🏠" text="Home" active={$page.url.pathname == "/home"} />
        <!-- <MenuItem href="/login" icon="🔒" text="Login" active={false} /> -->
        <!-- <MenuItem href="/logout" icon="🔓" text="Logout" active={false} /> -->
        
        <MenuDivider />
        <MenuTitle text="🧑 Person" />
        <MenuDivider />

        <MenuItem href="/person/customer" icon="" text="customer" active={$page.url.pathname == "/person/customer"} />
        <MenuItem href="/person/supplier" icon="" text="supplier" active={$page.url.pathname == "/person/supplier"} />
        <MenuItem href="/person/driver" icon="" text="driver" active={$page.url.pathname == "/person/driver"} />

        <MenuDivider />
        <MenuTitle text="🧑 Product" />
        <MenuDivider />

        <MenuItem href="/product" icon="" text="product" active={$page.url.pathname == "/product"} />
        <MenuItem href="/product_type" icon="" text="product type" active={$page.url.pathname == "/product_type"} />

        <MenuDivider />
        <MenuTitle text="🚛 Vehicle" />
        <MenuDivider />
        <MenuItem href="/vehicle" icon="" text="vehicle" active={$page.url.pathname == "/vehicle"} />

        <MenuDivider />
        <MenuTitle text="🧺 Inventory" />
        <MenuDivider />
        <MenuItem href="/inventory" icon="" text="inventory" active={$page.url.pathname == "/inventory"} />

        <MenuDivider />
        <MenuTitle text="📝 Report" />
        <MenuDivider />
        <MenuItem href="/report" icon="" text="report" active={$page.url.pathname == "/report"} />
        
    </Menu>

    <div class="contain">
        <Appbar>
            <Button onClick={handleClick}>Toggle</Button>
            <div class="right">
                <!-- <MenuItem href="/logout" icon="🔓" text="Logout" active={false} /> -->
                <h1>
                    <a href="/logout">
                        🔒
                        <span>Logout</span>
                    </a>
                </h1>
                
                <h1>👨‍🎨</h1>
            </div>
            
        </Appbar>

        <Container align="flex-start">
            <slot />
        </Container>
    </div>
	
    
    
</div>


<style>
.main {
	/* height: 100vh; */
    min-height: 100dvh;

	/* width: 100vw; */
	background-color: var(--color-light);

	display: flex;
	flex-direction: row;
}

.contain {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0 1rem;

    & a {
        text-decoration: none;
        & span {
            position: absolute;
            display: none;
            background-color: white;
            font-size: small;
        }

        &:hover span {
            display: block;
            padding: 0.5rem;
            border: 1px solid #ccc;
        }
    }
}
</style>