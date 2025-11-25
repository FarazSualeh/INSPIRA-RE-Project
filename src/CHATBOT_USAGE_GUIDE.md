# STEM Chatbot Usage Guide

## For Students

### How to Access the Chatbot

1. **Login** to your student dashboard
2. Look for the **floating purple/pink gradient button** in the bottom-right corner
3. **Click the button** - the chat window will slide open
4. Start asking questions about Science, Technology, Engineering, or Math!

### What Can You Ask?

#### Science Topics
- "What is photosynthesis?"
- "Tell me about gravity"
- "How does photosynthesis work?"
- "What is DNA?"
- "Tell me about planets"

#### Math Topics
- "What is addition?"
- "Explain fractions"
- "What is geometry?"
- "Tell me about pi"
- "What is multiplication?"

#### Technology Topics
- "How does a computer work?"
- "What is coding?"
- "Tell me about robots"
- "What is the internet?"
- "How do smartphones work?"

#### Engineering Topics
- "What is engineering?"
- "Tell me about bridges"
- "How do machines work?"
- "What is civil engineering?"

### Using Suggestion Buttons

After the bot responds, you'll see **suggestion buttons** with related questions:
- **Click any suggestion** to automatically ask that question
- Suggestions are contextual based on what you just asked
- Great for exploring topics deeper!

### Tips for Best Results

1. **Be specific** - Instead of "science", ask "What is photosynthesis?"
2. **Start simple** - Say "hello" to get started
3. **Use suggestions** - They'll guide you to related topics
4. **Ask follow-ups** - Build on previous questions
5. **Try Hindi** - The bot understands both English and Hindi!

## For Teachers

### Knowledge Base Coverage

The chatbot currently covers:
- **Mathematics**: Basic operations, geometry, fractions, decimals
- **Science**: Biology, physics, chemistry basics
- **Technology**: Computers, internet, coding, AI
- **Engineering**: Types, famous structures, basics

### Student Learning Benefits

✅ **24/7 Availability** - Students can learn anytime  
✅ **Instant Feedback** - Quick responses to questions  
✅ **Self-Paced** - Students control the conversation  
✅ **Encourages Curiosity** - Suggestions spark interest  
✅ **Multi-Language** - Supports English and Hindi  
✅ **Safe Environment** - Pre-approved educational content  

### Monitoring Student Usage

The chatbot is designed for:
- **Quick clarifications** during homework
- **Exploring new topics** before/after lessons
- **Reinforcing concepts** learned in class
- **Satisfying curiosity** about STEM subjects

## For Developers

### Adding New Knowledge

Edit `/components/STEMChatbotSimple.tsx` and add to the `getResponse` function:

```typescript
if (lower.includes("YOUR_KEYWORD")) {
  return {
    text: "Your educational response here! 🚀",
    suggestions: ["Related question 1?", "Related question 2?"],
  };
}
```

### Expanding Language Support

Add translations in the `translations` object:

```typescript
const translations = {
  en: {
    title: "STEM AI Assistant",
    // ... more translations
  },
  hi: {
    title: "STEM AI सहायक",
    // ... more translations
  },
  // Add new language here
  es: {
    title: "Asistente AI STEM",
    // ... Spanish translations
  },
};
```

### Customizing Appearance

All styles are inline CSSProperties objects. Edit these variables in the component:

- `floatingButtonStyle` - The floating button appearance
- `chatWindowStyle` - The chat window dimensions
- `headerStyle` - The header gradient colors
- `botMessageStyle` - Bot message bubbles
- `userMessageStyle` - User message bubbles

### Debugging

Check browser console for:
```
Opening chatbot...
Closing chatbot...
```

These logs confirm button clicks are registering.

## Common Questions

### Q: The bot doesn't understand my question
**A**: The simplified version uses keyword matching. Try rewording your question or use suggestion buttons.

### Q: Can I add more topics?
**A**: Yes! Edit the `getResponse` function to add more keyword-based responses.

### Q: Does it remember previous conversations?
**A**: Currently no - each session is fresh. Can be added with localStorage or backend integration.

### Q: Can I change the colors?
**A**: Yes! Edit the inline CSS gradient colors in the style objects.

### Q: Is there a typing limit?
**A**: No character limit, but keep questions concise for best results.

## Technical Specifications

- **Component**: React Functional Component
- **State Management**: React useState hooks
- **Styling**: Inline CSSProperties
- **Animations**: CSS @keyframes
- **Languages**: English, Hindi (extensible)
- **Knowledge Base**: Keyword-based pattern matching
- **Dependencies**: React, Lucide Icons only

## Future Enhancements

Planned features:
- [ ] Voice input/output
- [ ] Math equation rendering
- [ ] Image/diagram support
- [ ] Conversation history
- [ ] Backend API integration
- [ ] Machine learning responses
- [ ] Code syntax highlighting
- [ ] Quiz generation
- [ ] Progress tracking

---

**Need Help?** Check the console for errors or contact the Team INSPIRA developers: Faraz, Raasikh and Burhan.
