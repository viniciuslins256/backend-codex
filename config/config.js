const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env){
        case 'dev':
            return {
                bd_string: 'mongodb+srv://codex:S8204EaAfoQpA2lq@cluster0.cofvm.mongodb.net/main?retryWrites=true&w=majority',
                jwt_pass: 'batatafrita2019',
                jwt_expires_in: '7d'
            }

        case 'hml':
            return {
                bd_string: 'mongodb+srv://codex:S8204EaAfoQpA2lq@cluster0.cofvm.mongodb.net/main?retryWrites=true&w=majority',
                jwt_pass: 'batatafrita2019',
                jwt_expires_in: '7d'
            }

        case 'production':
            return {
                bd_string: 'mongodb+srv://codex:S8204EaAfoQpA2lq@cluster0.cofvm.mongodb.net/main?retryWrites=true&w=majority',
                jwt_pass: 'asdklas102318asldkan123ncm',
                jwt_expires_in: '7d'
            }
    };
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();