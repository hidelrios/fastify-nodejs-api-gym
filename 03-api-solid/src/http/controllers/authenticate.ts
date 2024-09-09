import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials-error";
import { AuthenticateUseCase } from "@/use-cases/authenticate";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUserRepository();
    const authenticateUseCase = new AuthenticateUseCase(usersRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(200).send();
}
