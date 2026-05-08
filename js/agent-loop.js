const STEPS = {
  trigger: {
    label: 'Step 1',
    title: 'Trigger: the user frames the outcome',
    body: 'The agent needs a useful starting point: the product goal, constraints, success measure, and permission boundary. A good trigger sounds like "find the highest-risk assumption in this onboarding idea and propose the cheapest test," not "think about onboarding."',
    note: 'Product lens: the PM or PE owns the outcome and the decision boundary before the agent starts working.'
  },
  reason: {
    label: 'Step 2',
    title: 'Reason: the model turns intent into a path',
    body: 'The reasoning model interprets the goal, breaks it into smaller decisions, weighs uncertainty, and chooses what to do next. For product work, this is where a vague ask becomes a test plan, risk scan, prototype brief, or escalation package.',
    note: 'Product lens: the model is useful when the problem has a clear goal but the path is not known in advance.'
  },
  memory: {
    label: 'Step 3',
    title: 'Memory: the agent carries the right context forward',
    body: 'Memory is not just chat history. It includes the current task, prior product decisions, customer evidence, reusable policies, and lessons from earlier outcomes. Good context engineering keeps the signal and drops stale noise.',
    note: 'Product lens: memory turns one-off automation into compounding product judgment, but unmanaged memory can create drift.'
  },
  tools: {
    label: 'Step 4',
    title: 'Tools: intent becomes real action',
    body: 'Tools let the agent search, query analytics, update tickets, inspect files, run tests, or deploy a prototype. The model may decide which tool to use, but the system still needs typed inputs, permissions, logs, and safe execution boundaries.',
    note: 'Product lens: tools determine what the agent can actually change, so tool access should map to risk and trust.'
  },
  plan: {
    label: 'Step 5',
    title: 'Planning + reflection: the loop corrects itself',
    body: 'Planning decomposes the task; reflection checks whether the last action improved the situation. If confidence rises, the agent continues. If it gets stuck, sees conflicting evidence, or hits a policy boundary, it escalates.',
    note: 'Product lens: the strongest agent systems are governed by confidence thresholds, not by the illusion that every task should finish autonomously.'
  },
  environment: {
    label: 'Step 6',
    title: 'Act + learn: the environment sends feedback',
    body: 'The environment is where work becomes observable: product analytics, support queues, codebases, calendars, documents, customer conversations, or production systems. The agent acts, reads feedback, and either reports an answer or starts another loop.',
    note: 'Product lens: feedback closes the PDLC loop. Without evaluation and observability, an agent is just faster uncertainty.'
  }
};

export function initAgentLoop() {
  const lab = document.querySelector('.agent-loop-lab');
  if (!lab) return;

  const label = lab.querySelector('[data-loop="label"]');
  const title = lab.querySelector('[data-loop="title"]');
  const body = lab.querySelector('[data-loop="body"]');
  const note = lab.querySelector('[data-loop="note"]');
  const svg = lab.querySelector('.agent-loop-svg');
  const controls = lab.querySelectorAll('.agent-loop-control');
  const svgTargets = lab.querySelectorAll('[data-agent-step]:not(.agent-loop-control)');

  function activate(stepKey) {
    const step = STEPS[stepKey] ?? STEPS.trigger;
    if (label) label.textContent = step.label;
    if (title) title.textContent = step.title;
    if (body) body.textContent = step.body;
    if (note) note.textContent = step.note;

    controls.forEach((control) => {
      const isActive = control.dataset.agentStep === stepKey;
      control.classList.toggle('active', isActive);
      control.setAttribute('aria-pressed', String(isActive));
    });

    svgTargets.forEach((target) => {
      target.classList.toggle('is-active', target.dataset.agentStep === stepKey);
    });
    svg?.classList.add('is-filtered');
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => activate(control.dataset.agentStep));
  });
  svgTargets.forEach((target) => {
    target.addEventListener('click', () => activate(target.dataset.agentStep));
    target.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(target.dataset.agentStep);
      }
    });
  });

  activate('trigger');
}
