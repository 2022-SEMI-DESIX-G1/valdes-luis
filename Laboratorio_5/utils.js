(() => {
    const Utils = {
        methods: {
            fibonacci: (n) => {
                const arr = [];
                var x = 0;
                var y = 1;
                var z = 0;
                for(let i = 0; i < n; i++){
                    arr.push(x);
                    z = x + y;
                    x = y;
                    y = z;
                }
                return arr;
            },
        }
    }
    document.Utils = Utils;
})();