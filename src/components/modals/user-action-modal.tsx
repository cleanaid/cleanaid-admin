"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserAction } from "@/types/user"
import { AlertTriangle, Shield, Trash2, UserX, UserCheck } from "lucide-react"

interface UserActionModalProps {
  action: UserAction | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (action: UserAction, password: string, reason?: string) => void
}

export function UserActionModal({ action, isOpen, onClose, onConfirm }: UserActionModalProps) {
  const [password, setPassword] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!action) return null

  const getActionDetails = () => {
    switch (action.type) {
      case 'delete':
        return {
          title: 'Delete User',
          description: 'This action cannot be undone. This will permanently delete the user and all associated data.',
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          confirmText: 'Delete User',
          confirmVariant: 'destructive' as const,
          requiresReason: true,
        }
      case 'suspend':
        return {
          title: 'Suspend User',
          description: 'The user will be suspended and unable to access their account until reactivated.',
          icon: <UserX className="h-6 w-6 text-yellow-600" />,
          confirmText: 'Suspend User',
          confirmVariant: 'default' as const,
          requiresReason: true,
        }
      case 'activate':
        return {
          title: 'Activate User',
          description: 'The user will be able to access their account normally.',
          icon: <UserCheck className="h-6 w-6 text-green-600" />,
          confirmText: 'Activate User',
          confirmVariant: 'default' as const,
          requiresReason: false,
        }
      case 'deactivate':
        return {
          title: 'Deactivate User',
          description: 'The user will be deactivated and unable to access their account.',
          icon: <UserX className="h-6 w-6 text-yellow-600" />,
          confirmText: 'Deactivate User',
          confirmVariant: 'default' as const,
          requiresReason: true,
        }
      default:
        return {
          title: 'User Action',
          description: 'Perform an action on this user.',
          icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
          confirmText: 'Confirm',
          confirmVariant: 'default' as const,
          requiresReason: false,
        }
    }
  }

  const actionDetails = getActionDetails()

  const handleConfirm = async () => {
    if (!password.trim()) return
    
    setIsLoading(true)
    try {
      await onConfirm(action, password, reason.trim() || undefined)
      handleClose()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPassword("")
    setReason("")
    setIsLoading(false)
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            {actionDetails.icon}
            <AlertDialogTitle>{actionDetails.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {actionDetails.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Password Verification */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Admin Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Reason (if required) */}
          {actionDetails.requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!password.trim() || (actionDetails.requiresReason && !reason.trim()) || isLoading}
            className={actionDetails.confirmVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Processing...' : actionDetails.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
