import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0', // Versão padrão do mercado
        info: {
            title: 'API @rpg Sistemas',
            version: '1.0.0',
            description: 'Documentação completa do sistema de eventos e usuários',
        },
        servers: [
            {
                url: 'http://localhost:4444',
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { // Didática: Isso aqui permite que o Swagger use seu Token JWT
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Didática: Aqui dizemos para o Swagger ler todos os arquivos de rotas
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);