/* =========================================================
   Grow the Tree: scenario content
   Each scenario feeds the same 9 levels. To add your own,
   copy one object in SCENARIOS and change the text.
   ========================================================= */

/* Marty Cagan's four big product risks */
const RISKS = [
  {id:'value', label:'Value', hint:'will they buy it or choose to use it?'},
  {id:'usab',  label:'Usability', hint:'can they figure out how to use it?'},
  {id:'feas',  label:'Feasibility', hint:'can we build it with what we have?'},
  {id:'viab',  label:'Business viability', hint:'does it work for the business?'}
];

const SCENARIOS = [
/* ---------------------------------------------------------- */
{
  id:'forkful', emoji:'🍳', name:'Forkful', tag:'Consumer app',
  blurb:'A recipe app that wants people to cook more often at home.',
  intro:`You're the product manager at <b>Forkful</b>, a recipe app. With your designer and tech lead (your <b>product trio</b>), you've been asked to grow engagement.`,
  outcomeQ:'Leadership wants "more engagement". Which outcome should your trio commit to?',
  outcomeOpts:[
    {text:'Launch the new meal-planner feature by the end of Q3', v:'wrong', why:'That\'s an <b>output</b>: something you ship. Shipping a feature tells you nothing about whether it changed customer behavior.'},
    {text:'Increase annual revenue by 15%', v:'partial', why:'That\'s a <b>business outcome</b>. It matters, but it lags and has many causes, so your trio can\'t move it directly. Find the product outcome that drives it.'},
    {text:'Increase the share of active users who cook 3+ Forkful recipes a week', v:'correct', why:'A <b>product outcome</b>: it measures customer behavior, your team can influence it directly, and it should drive the business results.'},
    {text:'Make our users happier', v:'wrong', why:'It\'s a good intention, but you can\'t measure it, so you\'d never know whether you were making progress.'}
  ],
  treeOutcome:'More active users cook 3+ recipes / week',
  oppCards:[
    {text:'"I never know what to make with what\'s already in my fridge."', a:'opp', why:'A real pain point, in the customer\'s own words.'},
    {text:'"You should add a barcode scanner for groceries."', a:'sol', why:'A feature request. Ask what need sits behind it, because that need is the opportunity.'},
    {text:'"By Tuesday night I\'m too tired for anything complicated."', a:'opp', why:'A need that came out of a specific story. Great for the tree.'},
    {text:'We need more users to finish onboarding.', a:'biz', why:'That\'s our goal, not a need the customer has. Opportunities are framed from the customer\'s point of view.'},
    {text:'"I end up throwing away food I bought."', a:'opp', why:'A pain point that matters to the customer, and one many products could address.'},
    {text:'Send a weekly push notification with recipes.', a:'sol', why:'That\'s one way to solve something. Solutions go below the opportunity they address.'},
    {text:'"I want my kids to actually eat what I cook."', a:'opp', why:'A desire. Opportunities include wants, not just pains.'},
    {text:'Increase time spent in the app.', a:'biz', why:'That\'s a metric we care about, not a need the customer has.'}
  ],
  parking:['Nothing to make with fridge leftovers','Too tired for complicated meals','Throwing away food','Kids won\'t eat it'],
  parents:[{id:'decide',text:'Deciding what to cook'},{id:'shop',text:'Getting the ingredients'},{id:'cook',text:'Cooking the meal'}],
  structure:[
    {text:'"I don\'t know what to make with what\'s in my fridge."', short:'Nothing to make with what I have', a:'decide', why:'This happens while you\'re picking a meal.'},
    {text:'"I keep cooking the same five meals."', short:'Stuck cooking the same 5 meals', a:'decide', why:'A rut is a problem with <i>choosing</i> what to cook.'},
    {text:'"I forget one ingredient and have to run back to the store."', short:'Forget an ingredient', a:'shop', why:'This one is about getting the ingredients.'},
    {text:'"Grocery shopping eats my whole Saturday."', short:'Shopping takes too long', a:'shop', why:'Also part of getting the ingredients.'},
    {text:'"I lose my place in the recipe when my hands are messy."', short:'Lose my place in the recipe', a:'cook', why:'This happens at the stove, while cooking.'},
    {text:'"Recipes always take longer than they say."', short:'Recipes take longer than promised', a:'cook', why:'A pain point that comes up while cooking.'}
  ],
  strategy:'Be the most inspiring place to discover what to cook.',
  targetShort:'Stuck cooking the same 5 meals',
  targetQuote:'I keep cooking the same five meals',
  targetOpts:[
    {text:'"I keep cooking the same five meals"', bars:{Reach:80,Frequency:85,'Strategy fit':95,'Competitors weak':80}, v:'correct', why:'It affects many customers, comes up every week, fits the strategy, and competitors haven\'t solved it. Pursuing it can move your outcome and set you apart.'},
    {text:'"I forget an ingredient"', bars:{Reach:45,Frequency:35,'Strategy fit':25,'Competitors weak':30}, v:'wrong', why:'It\'s a real pain, but it doesn\'t happen often, it\'s far from your strategy, and grocery apps already solve it.'},
    {text:'"I lose my place in the recipe"', bars:{Reach:65,Frequency:70,'Strategy fit':45,'Competitors weak':15}, v:'partial', why:'A reasonable choice, but competitors have already solved it. Fixing it is table stakes: you\'d catch up, not stand out.'}
  ],
  solutions:[
    {text:'"Surprise me": one tap for a recipe from a cuisine you\'ve never cooked', ok:true, short:'"Surprise me" button', why:'Directly breaks the rut.'},
    {text:'Hands-free voice mode that reads out each step', ok:false, why:'Addresses "lose my place in the recipe", not your target.'},
    {text:'Weekly themed cook-along challenge with friends', ok:true, short:'Cook-along challenge with friends', why:'Brings new dishes and a little social motivation.'},
    {text:'Auto-generated shopping list', ok:false, why:'Addresses "forget an ingredient", a different branch of the tree.'},
    {text:'"Twist it": swap one ingredient in a meal you already love', ok:true, short:'"Twist it" ingredient swaps', why:'Small, low-effort variety, built on meals people already cook.'},
    {text:'Redesign the settings page', ok:false, why:'This doesn\'t connect to any opportunity on the tree. If an idea doesn\'t map to an opportunity, question it.'},
    {text:'Taste-profile quiz that recommends new dishes', ok:true, short:'Taste-profile recommendations', why:'Points people toward new meals they\'re likely to enjoy.'}
  ],
  testedShort:'Cook-along challenge with friends',
  testedLong:'weekly cook-along challenge with friends',
  assumptions:[
    {text:'Customers want to cook the same dish as their friends.', a:'value', why:'Whether customers will choose to use it at all is <b>value risk</b>.'},
    {text:'People will find and understand the "Join challenge" button.', a:'usab', why:'Whether people can figure out how to use it is <b>usability risk</b>.'},
    {text:'We can match friends from contacts without slowing the app down.', a:'feas', why:'Whether our engineers can build it with the time, skills and tech we have is <b>feasibility risk</b>.'},
    {text:'Challenges will lift weekly cooking enough to be worth the build cost.', a:'viab', why:'Whether it works for the business is <b>business viability risk</b>.'},
    {text:'Sharing what people cook won\'t expose sensitive diet or health information.', a:'viab', why:'Cagan counts legal, privacy and ethical concerns as part of <b>business viability</b>.'}
  ],
  riskiest:[
    {text:'Customers want to cook the same dish as their friends', meta:'Value · Importance: critical · Evidence: none. Not one interviewee has mentioned cooking socially.', v:'correct', why:'Critical and completely unproven. If it\'s false, nothing else about the idea matters.'},
    {text:'People will find the "Join challenge" button', meta:'Usability · Importance: medium · Evidence: little, but it\'s easy to fix after launch', v:'wrong', why:'It matters, but you can fix it cheaply later. It isn\'t a leap of faith.'},
    {text:'We can match friends from contacts', meta:'Feasibility · Importance: high · Evidence: strong. Engineering built this for another feature.', v:'wrong', why:'You already have strong evidence. Testing it again wastes a cycle.'},
    {text:'Challenges will lift weekly cooking enough to pay off', meta:'Viability · Importance: high · Evidence: none', v:'partial', why:'It\'s risky too, but it depends on value. If nobody wants it, viability is moot, so test value first.'}
  ],
  matchCards:[
    {text:'Show a fake "Join this week\'s challenge" card and count the taps.', a:'value', why:'A fake-door demand test measures whether people want it: value risk.'},
    {text:'Watch 5 people try a clickable prototype of the challenge flow.', a:'usab', why:'Prototype testing with real users reveals usability risk.'},
    {text:'An engineer spends 2 days building contact matching on a test build.', a:'feas', why:'A spike or feasibility prototype answers "can we build it?"'},
    {text:'Walk legal and the privacy lead through what gets shared.', a:'viab', why:'Viability risks are tested with the stakeholders who own them: legal, finance, sales, and so on.'}
  ],
  leapShort:'People want to cook with friends',
  leapLong:'Customers want to cook the same dish as their friends.',
  testOpts:[
    {text:'Ask 20 customers: "Would you join a cooking challenge with friends?"', v:'wrong', why:'People are bad at predicting what they will do. Ask about what they <b>did</b>, not what they <i>would</i> do.'},
    {text:'Build the full feature and A/B test it', v:'wrong', why:'Too slow and expensive. If the assumption is wrong you\'ve wasted weeks. Test the assumption, not the whole idea.'},
    {text:'One-question survey: "When did you last cook a meal with or for friends?" Success = 30%+ in the past month, agreed before sending.', v:'correct', why:'It asks about past behavior, it\'s fast, and the success criteria are set in advance so you can\'t move the goalposts.'},
    {text:'Add a fake "Join a challenge" button and see how many people click', v:'partial', why:'A good kind of test, but you never said in advance what click rate counts as success, so any result could be argued either way.'},
    {text:'Debate it with stakeholders until everyone agrees', v:'wrong', why:'Opinions aren\'t evidence. Go and collect data instead.'}
  ],
  testShort:'Survey: cooked with friends last month? (≥30%)'
},
/* ---------------------------------------------------------- */
{
  id:'shiftly', emoji:'🗓️', name:'Shiftly', tag:'B2B SaaS',
  blurb:'Staff scheduling software for independent restaurant managers.',
  intro:`You're the product manager at <b>Shiftly</b>, scheduling software for independent restaurants. Your trio owns the scheduling experience, and the company wants more managers to rely on it every week.`,
  outcomeQ:'The CEO says "managers need to love scheduling with us". Which outcome should your trio commit to?',
  outcomeOpts:[
    {text:'Ship AI auto-scheduling by Q2', v:'wrong', why:'That\'s an <b>output</b>. It\'s possible to ship it on time and change nothing for managers.'},
    {text:'Grow annual recurring revenue to $5M', v:'partial', why:'A <b>business outcome</b>. Sales, pricing and churn all drive it, so it\'s too far from what your trio controls day to day.'},
    {text:'Increase the share of managers who publish next week\'s schedule in Shiftly by Thursday', v:'correct', why:'A <b>product outcome</b>: a behavior you can measure every week and influence directly, and it\'s a strong signal of retention.'},
    {text:'Become the #1 scheduling tool in the market', v:'wrong', why:'An aspiration, not an outcome. It\'s hard to measure, and the team can\'t move it directly.'}
  ],
  treeOutcome:'More managers publish schedules in Shiftly by Thursday',
  oppCards:[
    {text:'"Every Sunday night I spend two hours rebuilding the schedule from scratch."', a:'opp', why:'A specific, painful story from the customer\'s point of view.'},
    {text:'"You should integrate with our POS system."', a:'sol', why:'A feature request. Ask what they would do with it, and you\'ll find the real need.'},
    {text:'"When someone calls in sick, I\'m texting ten people to find cover."', a:'opp', why:'A clear pain point that comes up again and again.'},
    {text:'We need to reduce churn among small restaurants.', a:'biz', why:'A company goal, not a customer need. It belongs in how you pick your outcome.'},
    {text:'"I never know who\'s actually available until they tell me they can\'t work."', a:'opp', why:'A need in the customer\'s words.'},
    {text:'Add a drag-and-drop calendar.', a:'sol', why:'A solution. Which customer need would it address?'},
    {text:'"I worry I\'m accidentally breaking overtime rules."', a:'opp', why:'An anxiety is an opportunity too.'},
    {text:'Get more managers onto the annual plan.', a:'biz', why:'A business goal. Customers don\'t wake up wanting an annual plan.'}
  ],
  parking:['Rebuilding the schedule every week','Finding cover for sick calls','Unknown availability','Worried about overtime rules'],
  parents:[{id:'build',text:'Building the schedule'},{id:'share',text:'Sharing it with staff'},{id:'change',text:'Handling last-minute changes'}],
  structure:[
    {text:'"I rebuild the schedule from scratch every week."', short:'Rebuild from scratch weekly', a:'build', why:'This is part of building the schedule.'},
    {text:'"I don\'t know who\'s available until it\'s too late."', short:'Availability is unknown', a:'build', why:'You need availability to build the schedule.'},
    {text:'"Staff say they never saw the schedule."', short:'Staff miss the schedule', a:'share', why:'This happens after the schedule is built, when it\'s shared.'},
    {text:'"I\'m posting screenshots in three group chats."', short:'Posting in many chats', a:'share', why:'Also part of sharing the schedule.'},
    {text:'"Finding cover for a sick call takes forever."', short:'Finding sick-call cover', a:'change', why:'A last-minute change.'},
    {text:'"Shift swaps happen without me knowing."', short:'Untracked shift swaps', a:'change', why:'Also a last-minute change.'}
  ],
  strategy:'Give managers their Sunday nights back by making routine work disappear.',
  targetShort:'Rebuild from scratch weekly',
  targetQuote:'I rebuild the schedule from scratch every week',
  targetOpts:[
    {text:'"I rebuild the schedule from scratch every week"', bars:{Reach:90,Frequency:90,'Strategy fit':95,'Competitors weak':70}, v:'correct', why:'Nearly every manager does it every week, it\'s exactly what the strategy targets, and competitors still make managers start over.'},
    {text:'"Staff say they never saw the schedule"', bars:{Reach:60,Frequency:60,'Strategy fit':45,'Competitors weak':20}, v:'partial', why:'A real pain, but chat apps and competitors already handle sharing well, and it\'s a weaker fit with the strategy.'},
    {text:'"Shift swaps happen without me knowing"', bars:{Reach:35,Frequency:30,'Strategy fit':40,'Competitors weak':50}, v:'wrong', why:'It doesn\'t affect many managers and it doesn\'t happen often, so it won\'t move a weekly outcome much.'}
  ],
  solutions:[
    {text:'"Copy last week" in one click, then tweak', ok:true, short:'Copy last week', why:'Removes the "from scratch" part right away.'},
    {text:'Group-chat integration that broadcasts the schedule', ok:false, why:'Addresses "staff miss the schedule", a different branch.'},
    {text:'Staff enter their availability in the app, and drafts fill themselves in', ok:true, short:'Auto-fill from availability', why:'Builds most of the schedule before the manager opens it.'},
    {text:'One-tap broadcast to find cover for a sick call', ok:false, why:'Addresses "finding sick-call cover", not your target.'},
    {text:'Templates for recurring weekly patterns', ok:true, short:'Recurring templates', why:'Turns a weekly rebuild into a quick review.'},
    {text:'Dark mode', ok:false, why:'Not connected to any opportunity on the tree.'},
    {text:'Suggested staffing levels based on last month\'s sales', ok:true, short:'Sales-based suggestions', why:'Takes the guesswork out of each rebuild.'}
  ],
  testedShort:'Auto-fill from availability',
  testedLong:'auto-filled draft schedule based on staff availability',
  assumptions:[
    {text:'Managers want a draft built for them instead of building it themselves.', a:'value', why:'Whether managers will choose to use it is <b>value risk</b>.'},
    {text:'Staff will keep their availability up to date in the app.', a:'value', why:'If staff won\'t do their part, the product delivers no value. That makes this <b>value risk</b> for a second user group.'},
    {text:'Managers can understand and edit an auto-filled draft without training.', a:'usab', why:'Whether they can figure it out is <b>usability risk</b>.'},
    {text:'We can generate a draft in seconds for a 40-person restaurant.', a:'feas', why:'Whether we can build and run it is <b>feasibility risk</b>.'},
    {text:'Auto-generated schedules will respect local labor laws, so we don\'t take on legal risk.', a:'viab', why:'Legal exposure is a <b>business viability</b> risk.'}
  ],
  riskiest:[
    {text:'Staff will keep their availability up to date', meta:'Value · Importance: critical · Evidence: none. Managers say staff ignore apps.', v:'correct', why:'Without up-to-date availability, auto-fill can\'t work, and what you\'ve heard so far points the wrong way. That makes it the leap of faith.'},
    {text:'Managers want a draft built for them', meta:'Value · Importance: critical · Evidence: strong. 9 of 12 interviewees asked for less weekly effort.', v:'wrong', why:'Important, but you already have good evidence for it.'},
    {text:'We can generate drafts in seconds', meta:'Feasibility · Importance: high · Evidence: strong. An engineering prototype ran in 2 seconds.', v:'wrong', why:'Already tested. Move on.'},
    {text:'Schedules respect local labor laws', meta:'Viability · Importance: high · Evidence: some. Legal has reviewed similar rules before.', v:'partial', why:'It matters, but a working session with legal can settle it quickly. The value risk is the bigger unknown.'}
  ],
  matchCards:[
    {text:'Ask staff at 3 pilot restaurants to enter availability for 2 weeks, and track how many do.', a:'value', why:'Watching real behavior over time tests value risk.'},
    {text:'Walk 5 managers through a clickable draft and ask them to fix two shifts.', a:'usab', why:'Task-based prototype testing reveals usability risk.'},
    {text:'Engineering spike: generate drafts from 3 real restaurants\' data.', a:'feas', why:'A feasibility prototype answers "can we build it?"'},
    {text:'Review the auto-scheduling rules with legal for your top 5 states.', a:'viab', why:'Viability risks get tested with the stakeholders who own them.'}
  ],
  leapShort:'Staff keep availability up to date',
  leapLong:'Staff will keep their availability up to date in the app.',
  testOpts:[
    {text:'Ask staff: "Would you update your availability every week?"', v:'wrong', why:'People say yes to hypothetical questions. Watch what they actually do.'},
    {text:'Build full auto-scheduling and launch it to everyone', v:'wrong', why:'Weeks of work to learn something a small pilot could tell you in two weeks.'},
    {text:'Pilot at 3 restaurants: staff enter availability through a simple form for 2 weeks. Success = 70%+ of staff update it weekly, agreed beforehand.', v:'correct', why:'It measures real behavior, it\'s cheap to run, and the success threshold is set before you see any data.'},
    {text:'Add the availability form to the app and see what happens', v:'partial', why:'Close, but without a success threshold set in advance, you can talk yourself into any result.'},
    {text:'Let the sales team decide, since they know the customers', v:'wrong', why:'Sales input is useful, but it\'s not evidence about staff behavior.'}
  ],
  testShort:'Pilot: 70%+ of staff update availability weekly'
},
/* ---------------------------------------------------------- */
{
  id:'lingolane', emoji:'🗣️', name:'Lingo Lane', tag:'Consumer subscription',
  blurb:'A language-learning app whose new learners drop off in week two.',
  intro:`You're the product manager at <b>Lingo Lane</b>, a language-learning app. Lots of people sign up, but most stop by their second week. Your trio owns the new-learner experience.`,
  outcomeQ:'Leadership says "fix retention". Which outcome should your trio commit to?',
  outcomeOpts:[
    {text:'Release 50 new lessons this quarter', v:'wrong', why:'An <b>output</b>. More content doesn\'t mean people will come back to it.'},
    {text:'Increase subscription revenue by 20%', v:'partial', why:'A <b>business outcome</b>. Pricing, marketing and retention all drive it, so your trio can\'t move it directly.'},
    {text:'Increase the share of new learners who practice on 4+ days in their second week', v:'correct', why:'A <b>product outcome</b>: it\'s a leading indicator of retention, it\'s measurable, and the new-learner experience directly affects it.'},
    {text:'Make learning fun', v:'wrong', why:'Fun is a means, not something you can measure. How would you know you\'d achieved it?'}
  ],
  treeOutcome:'More new learners practice 4+ days in week 2',
  oppCards:[
    {text:'"I forget to practice until I\'m already in bed."', a:'opp', why:'A specific pain point from real life.'},
    {text:'"Add a leaderboard!"', a:'sol', why:'A solution. What would a leaderboard do for them? Look for that need.'},
    {text:'"I can read Spanish, but I freeze when someone talks to me."', a:'opp', why:'A deep need: being able to use the language for real.'},
    {text:'We need more users to upgrade to Premium.', a:'biz', why:'A business goal, not a learner need.'},
    {text:'"Lessons feel like homework, not real life."', a:'opp', why:'A pain point, in the learner\'s words.'},
    {text:'Send streak reminder emails.', a:'sol', why:'A solution, not an opportunity.'},
    {text:'"I don\'t know if I\'m actually getting better."', a:'opp', why:'Uncertainty about progress is a real need.'},
    {text:'Increase daily active users.', a:'biz', why:'A metric for the company, not a need for the customer.'}
  ],
  parking:['Forget to practice','Freeze in real conversations','Lessons feel like homework','Not sure I\'m improving'],
  parents:[{id:'fit',text:'Fitting practice into my day'},{id:'lesson',text:'Doing a lesson'},{id:'progress',text:'Seeing my progress'}],
  structure:[
    {text:'"I forget to practice until bedtime."', short:'Forget to practice', a:'fit', why:'This is about finding time in the day.'},
    {text:'"I only have time on the train, and I can\'t use sound."', short:'Only short, silent moments', a:'fit', why:'Also about fitting practice into the day.'},
    {text:'"Lessons feel like homework, not real life."', short:'Lessons feel like homework', a:'lesson', why:'This happens during the lesson itself.'},
    {text:'"Exercises are too easy, then suddenly too hard."', short:'Difficulty jumps around', a:'lesson', why:'Also part of the lesson experience.'},
    {text:'"I don\'t know if I\'m actually getting better."', short:'Unsure I\'m improving', a:'progress', why:'This is about seeing progress.'},
    {text:'"My streak broke, so I gave up."', short:'Lost streak, lost motivation', a:'progress', why:'A reaction to how progress is shown.'}
  ],
  strategy:'Help learners actually use the language in real life.',
  targetShort:'Lessons feel like homework',
  targetQuote:'Lessons feel like homework, not real life',
  targetOpts:[
    {text:'"Lessons feel like homework, not real life"', bars:{Reach:75,Frequency:90,'Strategy fit':95,'Competitors weak':75}, v:'correct', why:'It comes up in nearly every lesson, it\'s central to the strategy, and most competitors still feel like flashcards.'},
    {text:'"I forget to practice"', bars:{Reach:85,Frequency:80,'Strategy fit':35,'Competitors weak':10}, v:'partial', why:'Huge reach, but reminders are table stakes. Every competitor has them, and they won\'t make you stand out or deliver on the strategy.'},
    {text:'"My streak broke, so I gave up"', bars:{Reach:40,Frequency:25,'Strategy fit':30,'Competitors weak':40}, v:'wrong', why:'Fewer learners hit this, it happens rarely, and it fits the strategy poorly.'}
  ],
  solutions:[
    {text:'Role-play a real situation, like ordering coffee from an AI barista', ok:true, short:'Real-life role-plays', why:'Turns exercises into real-world practice.'},
    {text:'A push reminder at your usual commute time', ok:false, why:'Addresses "forget to practice", not your target.'},
    {text:'A weekly 15-minute live conversation with a native speaker', ok:true, short:'Live chat with a native speaker', why:'The most "real life" option there is.'},
    {text:'Weekly progress report emails', ok:false, why:'Addresses "unsure I\'m improving", a different branch.'},
    {text:'Lessons built around your own upcoming trip', ok:true, short:'Lessons for your next trip', why:'Makes every lesson personally relevant.'},
    {text:'A new app icon', ok:false, why:'Not connected to any opportunity.'},
    {text:'Short TV-show clips with quick comprehension questions', ok:true, short:'TV-clip lessons', why:'Real language, used the way native speakers use it.'}
  ],
  testedShort:'Live chat with a native speaker',
  testedLong:'weekly live conversation with a native speaker',
  assumptions:[
    {text:'New learners want to talk to a real person this early on.', a:'value', why:'Whether learners will choose to do it is <b>value risk</b>.'},
    {text:'Learners can book and join a call from the app without help.', a:'usab', why:'Whether they can figure it out is <b>usability risk</b>.'},
    {text:'We can match learners with native speakers across time zones.', a:'feas', why:'Whether we can make it work technically and operationally is <b>feasibility risk</b>.'},
    {text:'We can pay native speakers and keep today\'s subscription price.', a:'viab', why:'Unit economics are <b>business viability</b>.'},
    {text:'Live calls with strangers meet our safety and privacy obligations.', a:'viab', why:'Legal, safety and ethical concerns are part of <b>business viability</b>.'}
  ],
  riskiest:[
    {text:'New learners want to talk to a real person this early', meta:'Value · Importance: critical · Evidence: weak, and mixed. Many learners said they "freeze" around people.', v:'correct', why:'The whole idea depends on it, and the "I freeze" stories suggest beginners might avoid it. Test this first.'},
    {text:'Learners can book and join a call without help', meta:'Usability · Importance: medium · Evidence: some. Booking flows are a well-known pattern.', v:'wrong', why:'Worth checking later, but it\'s easy to fix.'},
    {text:'We can match learners across time zones', meta:'Feasibility · Importance: high · Evidence: strong. A tutor-marketplace partner already does this.', v:'wrong', why:'You already have good evidence for it.'},
    {text:'We can pay speakers and keep today\'s price', meta:'Viability · Importance: high · Evidence: none', v:'partial', why:'Risky, but it only matters if learners want the calls. Test value first.'}
  ],
  matchCards:[
    {text:'Book 15-minute calls by hand for 20 new learners and count who shows up.', a:'value', why:'A concierge test measures real demand: value risk.'},
    {text:'Have 5 learners try a clickable prototype of the booking flow.', a:'usab', why:'Prototype testing with real users reveals usability risk.'},
    {text:'Engineering spike with a tutor marketplace\'s scheduling API.', a:'feas', why:'A spike answers "can we build it?"'},
    {text:'Model the cost per call with finance at three usage levels.', a:'viab', why:'Viability gets tested with the people who own that risk, in this case finance.'}
  ],
  leapShort:'Beginners want to talk to a real person',
  leapLong:'New learners want to talk to a real person this early on.',
  testOpts:[
    {text:'Survey: "Would you like to practice with a native speaker?"', v:'wrong', why:'Almost everyone says yes to a nice-sounding hypothetical. Look at what people actually do.'},
    {text:'Build the full live-call platform and launch it', v:'wrong', why:'Months of work before you learn anything.'},
    {text:'Concierge test: offer 20 new learners a free 15-minute call, booked by hand. Success = 8+ show up and 5+ book another, agreed beforehand.', v:'correct', why:'Real behavior, almost no build, and success criteria agreed in advance.'},
    {text:'Put a "Book a call" button in the app and see what happens', v:'partial', why:'A good fake-door idea, but with no success threshold set in advance, the result is open to interpretation.'},
    {text:'Ask the language experts on the team what they think', v:'wrong', why:'Expert opinion is useful, but it isn\'t evidence of learner behavior.'}
  ],
  testShort:'Concierge: 8 of 20 show up, 5 rebook'
}
];

/* Turn a scenario into the 9 game levels */
function buildLevels(sc){
  return [
    {id:'outcome', type:'choice', eyebrow:'Level 1 · The root', title:'Plant the seed: choose your outcome', points:30,
      lead:'Every tree starts with one clear outcome at the root. That outcome is the change in customer behavior your team is responsible for moving.',
      q:sc.outcomeQ, options:sc.outcomeOpts,
      habit:'<strong>Outcomes over outputs.</strong> Teams that are given outcomes, not feature roadmaps, have room to discover the best way to create value.'},
    {id:'opps', type:'sort', eyebrow:'Level 2 · Discovering opportunities', title:'Sort the interview notes', pointsEach:10,
      lead:'Your trio interviewed customers this week. Each note below could go on the tree, but only <b>opportunities</b> should: customer needs, pain points and desires, told from the customer\'s point of view.',
      buckets:[{id:'opp',label:'Opportunity',hint:'a customer need or pain'},{id:'sol',label:'Solution in disguise',hint:'a feature idea'},{id:'biz',label:'Company need',hint:'what we want, not them'}],
      cards:sc.oppCards,
      done:'Only the opportunities go on the tree. Solutions wait until you have chosen a target, and company needs belong in your outcome, not in the opportunity space.',
      habit:'<strong>Interview every week.</strong> Ask for specific stories ("Tell me about the last time you…") rather than opinions or wish lists. Summarize each interview on a one-page snapshot.'},
    {id:'structure', type:'sort', eyebrow:'Level 3 · Structuring the space', title:'Give the opportunities a shape', pointsEach:10,
      lead:'Your experience map shows three key moments in a customer\'s journey. Put each opportunity under the moment where it happens. A child opportunity should be a smaller part of its parent.',
      buckets:sc.parents.map(p=>({id:p.id,label:p.text})), cards:sc.structure,
      done:'Look at the tree: each branch is a moment in the customer\'s journey, and the children are smaller parts of their parent.',
      habit:'<strong>Map the experience.</strong> When parent opportunities are moments in time, siblings stay distinct and gaps in your understanding become easy to see.'},
    {id:'target', type:'choice', eyebrow:'Level 4 · Assessing opportunities', title:'Pick a target opportunity', points:30,
      lead:'Before jumping to solutions, assess the opportunities. Compare siblings against each other (not each one alone) on reach, frequency, strategy fit and competition.',
      q:`Company strategy: <i>"${sc.strategy}"</i> Which opportunity do you target?`, options:sc.targetOpts,
      habit:'<strong>Compare and contrast.</strong> Weigh opportunities on reach, frequency, market factors, company factors and customer importance. Choose, learn and revisit: decisions on the tree can be undone.'},
    {id:'solutions', type:'multi', pick:3, eyebrow:'Level 5 · Generating solutions', title:'Pick three solutions to explore', pointsEach:10,
      lead:`Your trio brainstormed lots of ideas. Pick <b>three</b> that address your target opportunity, <i>"${sc.targetQuote}"</i>. Working on three at once lets you compare them instead of falling in love with one.`,
      options:sc.solutions,
      habit:'<strong>Avoid "whether or not" decisions.</strong> Asking "should we build X?" invites confirmation bias. Asking "which of these three is best?" makes you test them against each other.'},
    {id:'assumptions', type:'sort', eyebrow:'Level 6 · The four big risks', title:'What could go wrong?', pointsEach:10,
      lead:`You're exploring the <b>${sc.testedLong}</b>. Marty Cagan names four risks that every product idea has to address. Sort each assumption by the risk it belongs to.`,
      buckets:RISKS, cards:sc.assumptions,
      done:'Every idea carries all four risks. Discovery\'s job is to deal with them before engineers build anything for real.',
      habit:'<strong>Tackle the risks early.</strong> Cagan\'s value, usability, feasibility and business viability risks should be addressed in discovery, while ideas are still cheap to change.'},
    {id:'riskiest', type:'choice', eyebrow:'Level 7 · Assumption mapping', title:'Find the leap of faith', points:30,
      lead:'Put each assumption on a map of <b>how important</b> it is versus <b>how much evidence</b> you have. Test the top-left corner first: important assumptions with the least evidence. Value risk is often the biggest.',
      q:'Which assumption should you test first?', options:sc.riskiest,
      habit:'<strong>Assumption mapping.</strong> Sort assumptions by importance and evidence so you spend your testing time where the risk is highest.'},
    {id:'match', type:'sort', eyebrow:'Level 8 · Choosing a test', title:'Match each test to its risk', pointsEach:10,
      lead:'Each type of risk calls for a different kind of test. Which risk does each test address?',
      buckets:RISKS, cards:sc.matchCards,
      done:'A rule of thumb: value → demand or concierge tests; usability → prototype tests with users; feasibility → engineering spikes; viability → reviews with the stakeholders who own the risk.',
      habit:'<strong>Fit the test to the risk.</strong> Use the cheapest test that can actually show you\'re wrong.'},
    {id:'test', type:'choice', eyebrow:'Level 9 · Testing', title:'Design a fast, honest test', points:30,
      lead:`Your leap of faith is <i>"${sc.leapLong}"</i> Choose the best way to test it this week.`,
      q:'Which test do you run?', options:sc.testOpts,
      habit:'<strong>Small, fast, iterative tests.</strong> Agree on success criteria before you run a test. Many small tests beat one big bet.'}
  ];
}
function levelMax(l){ return l.type==='choice'? l.points : l.type==='multi'? l.pick*l.pointsEach : l.cards.length*l.pointsEach; }
