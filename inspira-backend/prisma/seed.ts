import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const user1 = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: 'password123', // In a real app, hash the password
      name: 'Student User',
      role: 'student',
      grade: '8',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      password: 'password123', // In a real app, hash the password
      name: 'Teacher User',
      role: 'teacher',
    },
  });

  // Seed classes
  await prisma.class.create({
    data: {
      teacher_id: user2.id,
      class_name: 'Math 101',
      grade: '8',
      subject: 'Math',
      description: 'Introduction to Mathematics',
      student_count: 30,
    },
  });

  // Seed activities
  await prisma.activity.create({
    data: {
      subject: 'math',
      title: 'Basic Algebra Quiz',
      description: 'A quiz on basic algebra concepts.',
      grade_level: '8',
      activity_type: 'quiz',
      difficulty: 'medium',
      points_reward: 10,
      estimated_time_minutes: 30,
      content: {},
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });