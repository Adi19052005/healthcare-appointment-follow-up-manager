-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleCalendarConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleCalendarId" TEXT DEFAULT 'primary',
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);
