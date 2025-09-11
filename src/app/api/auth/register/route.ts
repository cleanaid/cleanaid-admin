import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // TODO: Replace with your actual database logic
    // This is a mock implementation
    const mockUser = {
      id: "2",
      name,
      email,
      role: "admin",
      createdAt: new Date().toISOString(),
    }

    // In a real application, you would:
    // 1. Hash the password
    // 2. Check if email already exists
    // 3. Save to database
    // 4. Send verification email

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: mockUser 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
