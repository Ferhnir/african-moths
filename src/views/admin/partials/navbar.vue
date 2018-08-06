<template>
    <b-navbar toggleable="md" type="dark" variant="dark" class="no-margin">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">Admin panel</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <!-- Using button-content slot -->
                    <template slot="button-content">
                    <em>Admin</em>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item @click="logout">Log out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script>
import {AUTH_LOGOUT} from '@/store/actions/auth.js'

    export default {
        name: 'navbar',
        data() {
            return {
                menuObj: {
                    admin: {
                        navbar: {
                            home: {},
                            insects: {},
                            categories: [
                            {name: 'families'},
                            {name: 'subfamilies'},
                            {name: 'tribes'},
                            {name: 'genus'},
                            {name: 'species'},
                            {name: 'food'}
                            ]
                        }
                    }
                }
            }
        },    
        methods: {
            logout: function() {
                this.$store.dispatch(AUTH_LOGOUT).then(() => {
                    this.$router.push('/login');
                });
            }
        }
    }
</script>
<style>
    .no-margin{
        margin: 0px;
    }
    .nav-link-item,
    span {
        text-transform: capitalize; 
    }
</style>

