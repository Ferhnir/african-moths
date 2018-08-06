import axios from 'axios'

export default {
    query(target, data, method) {
        return new Promise((resolve, reject) => {
            axios({
                url: 'http://africanmoths.com/api/insect/' + target, 
                data: data, 
                method: method 
            }).then(resp => {
                console.log(resp);
            }).catch(err => {
                console.log(err);
            });
        });
    }
}