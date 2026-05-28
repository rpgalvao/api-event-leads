import { hashPassword } from './src/libs/bcrypt';
import { prisma } from './src/libs/prisma';

async function main() {
    const email = 'admin@rpgsistemas.com.br';

    // Criptografando a senha padrão
    const password = await hashPassword('123456');

    // Inserindo o usuário direto no Neon
    const admin = await prisma.user.create({
        data: {
            name: 'Renato - Admin',
            email: email,
            password: password,
            role: 'ADMIN' // Garantindo o acesso total
        }
    });

    console.log(`✅ Administrador criado com sucesso: ${admin.email}`);
}

main()
    .catch((e) => {
        console.error("❌ Erro ao criar admin:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });