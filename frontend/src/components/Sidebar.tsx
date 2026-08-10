import type { Conversation } from '../types/chat'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string
  isOpen: boolean
  onClose: () => void
  onNew: () => void
  onSelect: (id: string) => void
}

export function Sidebar({ conversations, activeId, isOpen, onClose, onNew, onSelect }: SidebarProps) {
  return <>
    <button className={`scrim ${isOpen ? 'visible' : ''}`} onClick={onClose} aria-label="Close menu" />
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand"><span className="brand-orb">✦</span><span>Piyush <b>AI</b></span></div>
      <button className="new-chat" onClick={onNew}><span>＋</span> New conversation</button>
      <div className="history-label">Recent conversations</div>
      <nav className="history">
        {conversations.filter(c => c.messages.length).map(conversation =>
          <button key={conversation.id} className={conversation.id === activeId ? 'active' : ''} onClick={() => onSelect(conversation.id)}>
            <span className="chat-icon">◌</span><span>{conversation.title}</span>
          </button>,
        )}
      </nav>
      <div className="profile"><div className="profile-avatar">P</div><div><strong>Piyush</strong><small>AI Portfolio</small></div><span className="profile-more">•••</span></div>
    </aside>
  </>
}
