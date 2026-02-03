You don't need to fork React — the testability gap is architectural, not a framework bug. Here's why HTMX works better and what you'd actually need to change:            
                                                                                                                                                                            
  Why HTMX is agent-friendly                                                                                                                                                
                                                                                                                                                                            
  - DOM = truth. Server returns HTML, what's in the DOM is the real state. agent-browser snapshot sees everything immediately.                                              
  - No hydration gap. No blank page waiting for JS to boot.                                                                                                                 
  - Semantic HTML by default. Links are <a>, forms are <form>, buttons are <button>.                                                                                        
  - URL reflects state. Server-side routing means the URL is always meaningful.                                                                                             
                                                                                                                                                                            
  Why React/Next.js is harder                                                                                                                                               
                                                                                                                                                                            
  - Virtual DOM indirection. Real DOM lags behind React's internal fiber tree.                                                                                              
  - Hydration delay. SSR HTML is there but non-interactive until JS loads.                                                                                                  
  - div soup. Click handlers on <div>s instead of semantic elements — invisible to accessibility snapshots.                                                                 
  - Client state opacity. App state lives in React hooks/context, not the DOM.                                                                                              
  - Loading/suspense states. Agent snapshots catch intermediate states.                                                                                                     
                                                                                                                                                                            
  What would actually fix it (no fork needed)                                                                                                                               
                                                                                                                                                                            
  1. Use RSC (React Server Components) aggressively — same philosophy as HTMX, HTML from server                                                                             
  2. Semantic HTML — use <button>, <a>, <form> with action=, not onClick divs                                                                                               
  3. aria-* attributes everywhere — this is what agent-browser snapshot reads                                                                                               
  4. Server Actions over client fetches — forms post to server, like HTMX                                                                                                   
  5. Minimize client state — push state to URL params and server, not useState                                                                                              
  6. Add data-testid or meaningful role/aria-label to interactive elements                                                                                                  
                                                                                                                                                                            
  TL;DR                                                                                                                                                                     
                                                                                                                                                                            
  The pattern that makes HTMX testable is: server renders real HTML with semantic elements and state lives in the DOM/URL, not JS memory.                                   
                                                                                                                                                                            
  You can write React that way (RSC + server actions + semantic HTML + aria labels), but it fights React's defaults. HTMX makes it the only option, which is why it works so
   well.                                                                                                                                                                    
                                                                                                                                                                            
  Forking React wouldn't help — you'd need to fork every component library and every pattern in the ecosystem. Easier to just keep using HTMX if agent testability is a     
  priority.                                                                                                                                                                 
                                                                                                                                                                            
❯ but for a human user react is so much better the HTMX. HTMX is limited. If we want to do what you said what does the plan look like?                                      
                                                                                                                                                                            
⏺ Here's the plan — make React apps where the DOM is the source of truth for agents while keeping the rich interactivity humans love.                                       
                                                                                                                                                                            
  The approach: "Server-first React"                                                                                                                                        
                                                                                                                                                                            
  1. Default to Server Components                                                                                                                                           
                                                                                                                                                                            
  - Every page/layout is RSC unless it needs interactivity                                                                                                                  
  - Data fetching happens server-side, HTML ships complete                                                                                                                  
  - Agent sees real content on first snapshot, no waiting                                                                                                                   
                                                                                                                                                                            
  2. Server Actions for mutations                                                                                                                                           
                                                                                                                                                                            
  // NOT this (invisible to agents)                                                                                                                                         
  const handleSubmit = async () => {                                                                                                                                        
    await fetch('/api/leads', { method: 'POST', body: ... })                                                                                                                
  }                                                                                                                                                                         
                                                                                                                                                                            
  // THIS (agent sees a real <form>)                                                                                                                                        
  <form action={createLead}>                                                                                                                                                
    <input name="email" aria-label="Email" />                                                                                                                               
    <button type="submit">Save</button>                                                                                                                                     
  </form>                                                                                                                                                                   
                                                                                                                                                                            
  3. Client islands, not client pages                                                                                                                                       
                                                                                                                                                                            
  - Wrap only the interactive bit in 'use client'                                                                                                                           
  - Keep it small: a dropdown, a date picker, a modal                                                                                                                       
  - Parent page stays RSC — agent sees the structure                                                                                                                        
                                                                                                                                                                            
  4. State in URL, not useState                                                                                                                                             
                                                                                                                                                                            
  // NOT this                                                                                                                                                               
  const [tab, setTab] = useState('overview')                                                                                                                                
                                                                                                                                                                            
  // THIS — agent can navigate directly, snapshot reads it                                                                                                                  
  <Link href="?tab=overview">Overview</Link>                                                                                                                                
  <Link href="?tab=analytics">Analytics</Link>                                                                                                                              
  Use searchParams in server components to read state.                                                                                                                      
                                                                                                                                                                            
  5. Semantic HTML contract                                                                                                                                                 
                                                                                                                                                                            
  Enforce in the component library:                                                                                                                                         
  - Clickable? → <button> or <a>, never <div onClick>                                                                                                                       
  - List? → <ul>/<li>, not <div><div>                                                                                                                                       
  - Every interactive element gets aria-label or visible text                                                                                                               
  - Every form input gets <label> or aria-label                                                                                                                             
                                                                                                                                                                            
  6. Accessibility snapshot layer                                                                                                                                           
                                                                                                                                                                            
  Add an ESLint rule or custom lint:                                                                                                                                        
  - eslint-plugin-jsx-a11y (strict mode)                                                                                                                                    
  - Ban onClick on non-interactive elements                                                                                                                                 
  - Require aria-label on icon-only buttons                                                                                                                                 
                                                                                                                                                                            
  7. Loading states are agent-aware                                                                                                                                         
                                                                                                                                                                            
  // Give suspense boundaries identifiable states                                                                                                                           
  <Suspense fallback={<div role="status" aria-label="Loading leads">...</div>}>                                                                                             
    <LeadsTable />                                                                                                                                                          
  </Suspense>                                                                                                                                                               
  Agent can detect loading vs loaded.                                                                                                                                       
                                                                                                                                                                            
  8. Component library wrapper                                                                                                                                              
                                                                                                                                                                            
  For complex client widgets (rich dropdowns, datepickers, modals), wrap them with agent-friendly attributes:                                                               
  export const Select = ({ label, options, ...props }) => (                                                                                                                 
    <div role="combobox" aria-label={label} aria-expanded={open}>                                                                                                           
      {/* rich UI here */}                                                                                                                                                  
    </div>                                                                                                                                                                  
  )                                                                                                                                                                         
                                                                                                                                                                            
  What you keep from React that HTMX can't do                                                                                                                               
                                                                                                                                                                            
  - Optimistic UI updates                                                                                                                                                   
  - Complex drag-and-drop                                                                                                                                                   
  - Real-time collaborative features                                                                                                                                        
  - Rich animations/transitions                                                                                                                                             
  - Client-side filtering/sorting of large datasets                                                                                                                         
  - Offline support                                                                                                                                                         
                                                                                                                                                                            
  These stay as 'use client' islands — but they're wrapped in semantic, aria-labeled containers so agents can still interact with them.                                     
                                                                                                                                                                            
  Unresolved questions                                                                                                                                                      
                                                                                                                                                                            
  - Existing project or greenfield?                                                                                                                                         
  - Which component library (shadcn, radix, custom)?                                                                                                                        
  - Agent testing in CI or just local dev?                                                                                                                                  
  - How complex are the interactive bits (dashboards? forms? both?)                                                                                                         
                                                                                                                                                                            
❯ greenfield, shadcn, both, lets start with less complex for the first pass                                                                                                 
                                                                                                                                                                            
⏺ Let me ask a few things before I plan the scaffolding.                                                                                                                    
                                                                                                                                                                            
⏺ User answered Claude's questions:                                                                                                                                         
  ⎿  · What's the project/app about? Even a one-liner helps me pick realistic example pages. → SaaS dashboard                                                               
     · What should the repo be named? → agent-ready-next                                                                                                                    
     · Do you want the agent-browser CI tests wired into GitHub Actions from the start? → Yes, GitHub Action