<template>
    <div id="app">
        <form class="card card-sm">
            <div class="card-body row no-gutters align-items-center">
                <div class="col-auto">
                    <i class="fas fa-search h4 text-body"></i>
                </div>
                <!--end of col-->
                <div class="col">
                    <input v-model="productName"
                           class="form-control form-control-lg form-control-borderless product-search"
                           type="search"
                           placeholder="Search topics or keywords">
                </div>
                <!--end of col-->
                <div class="col-auto">
                    <button class="btn btn-lg btn-success" type="submit" @click.prevent="addProduct">Search</button>
                </div>
                <!--end of col-->
            </div>
        </form>
        <div>
            <ul>
                <li v-for="(item, index) in todoProduct">
                    <span> {{item}} </span>
                    <button @click="removeItem(index)"> Remove</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>


    export default {
        name: 'app',
        data() {
            return {
                productName: '',
                todoProduct: []
            }
        },

        methods: {
            removeItem(index) {
                console.log(index);
                console.log(this.todoProduct);
                this.todoProduct.splice(index, 1)
            },
            addProduct(name) {
                this.todoProduct.push(this.productName);
                this.productName = ''
            }
        },
    }

</script>


<style>
    .hidden {
        display: none;
    }


</style>
