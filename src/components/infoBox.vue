<template>
    <tr>
        <td class="text-center" colspan="4">
            <transition name="fade">
                <div class="alert alert-danger tbl-input-mid" role="alert">
                    {{message}}
                    <router-link :to="'/login'" v-if="buttonState">
                        <span class="glyphicon glyphicon-off"></span> Log in
                    </router-link>
                </div>
            </transition>
        </td>
    </tr>
</template>
<script>
export default {
  name: "infoBox",
  props: ["message", "buttonState"]
};
</script>
<style scoped>

</style>
                        