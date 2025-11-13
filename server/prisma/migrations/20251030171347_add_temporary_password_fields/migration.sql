-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTemporaryPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordExpiresAt" TIMESTAMP(3);
