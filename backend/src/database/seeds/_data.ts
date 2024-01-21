const data =
  '<h1 class="text-3xl font-semibold text-gray-100 pt-12 pb-2 tracking-wide leading-relaxed font-sohne"><strong class="font-bold text-gray-200">Introduction</strong></h1><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Within the bustling JavaScript ecosystem, few libraries command the reverence and ubiquity of Lodash. This comprehensive utility belt for developers, particularly prominent in Node.js applications, transcends mere convenience, offering a paradigm shift in code elegance and maintainability. Lodash empowers seasoned and novice developers alike, streamlining common tasks into concise, functional expressions. Its vast arsenal of meticulously crafted functions tackles everything from data manipulation and object processing to iteration and utility routines, all while adhering to best practices and performance optimization. Whether navigating the intricacies of arrays or orchestrating complex data transformations, Lodash serves as a trusted confidante, alleviating programmer burden and fostering code that is as effective as it is aesthetically pleasing. In this exploration, we will delve into the ten common but compelling use cases for Lodash within the context of Node.js development.</p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash is still very popular (48M downloads this week) even though it’s mostly into maintenance mode now.</p><img class="w-full object-contain mb-12 border-1 border-black3 hover:border-primary duration-200 hover:border-2 rounded-md object-center object-cover" src="https://miro.medium.com/v2/resize:fit:1400/1*6JI5N4ZogYf6greCW8B8Bg.png" alt=""><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Let’s get into the common use cases now.</p><h1 class="text-3xl font-semibold text-gray-100 pt-12 pb-2 tracking-wide leading-relaxed font-sohne"><strong class="font-bold text-gray-200">10 common use cases</strong></h1><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">1: Data Transformation</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Imagine you’re analyzing website visit data stored in an array named <code>visits</code>. This array contains objects with properties like <code>userId</code> and <code>pageVisited</code>. You want to extract a new array containing only unique user IDs.</p><pre class="my-12"><code>const allVisits = [\n  { userId: 1, pageVisited: \'Home\' },\n  { userId: 2, pageVisited: \'Product\' },\n  { userId: 1, pageVisited: \'About\' },\n  { userId: 3, pageVisited: \'Contact\' },\n];\n\nconst uniqueUserIds = _.uniq(_.map(allVisits, \'userId\')); // [ 1, 2, 3 ]</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">2: Object Manipulation</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Suppose you have a user object <code>user</code> with a nested address property, and you want to update the city within the address. This code uses <code>_.set</code> to modify the nested <code>city</code> property within the <code>address</code> object of the <code>user</code> object. The third argument specifies the new value for the city.</p><pre class="my-12"><code>const user = {\n  name: \'John Doe\',\n  address: {\n    country: \'USA\',\n    city: \'Chicago\',\n  },\n};\n\nconst updatedUser = _.set(user, \'address.city\', \'New York\');\n\nconsole.log(updatedUser); // { name: \'John Doe\', address: { country: \'USA\', city: \'New York\' } }</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">3: Finding in Array</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Consider a product catalog stored in an array named <code>products</code>. Each product object has a <code>rating</code> property. You want to find the product with the highest rating. This code utilizes a combination of Lodash functions:</p><ul class="list-disc text-slate1 ml-12"><li><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><code>_.map</code> extracts the <code>rating</code> property from each product, creating a new array of ratings.</p></li><li><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><code>Math.max</code> finds the highest value in the ratings array.</p></li><li><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><code>_.find</code> searches the original <code>products</code> array for the first product whose <code>rating</code> matches the highest value.</p></li></ul><pre class="my-12"><code>const products = [\n  { name: \'Shirt\', rating: 4.5 },\n  { name: \'Shoes\', rating: 4.7 },\n  { name: \'Hat\', rating: 4.2 },\n];\n\nconst topProduct = _.find(products, (product) =&gt; product.rating === Math.max(..._.map(products, \'rating\')));\n\nconsole.log(topProduct); // { name: \'Shoes\', rating: 4.7 }</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">4: Iterating an Array</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash empowers developers to gracefully navigate arrays and objects with a touch of functional magic. Imagine traversing a nested user object and generating a string containing all email addresses. This single line accomplishes what might require nested loops in vanilla JavaScript. Lodash functions like <code>_.map</code> and <code>_.flatten</code> seamlessly stitch together, extracting emails from each nested group and assembling them into a single array.</p><pre class="my-12"><code>const user = {\n  profile: {\n    friends: [{ email: \'alice@example.com\' }, { email: \'bob@example.com\' }],\n    family: [{ email: \'jane@example.com\' }],\n  },\n};\n\nconst emails = _.flatten(_.map(user.profile, (group) =&gt; _.map(group, \'email\'))); // [ \'alice@example.com\', \'bob@example.com\', \'jane@example.com\' ]</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">5: Utility Functions</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Beyond data manipulation, Lodash offers a treasure trove of utility functions for common tasks. Consider checking if an array contains any element matching a condition. These concise expressions leverage <code>_.some</code> and <code>_.every</code> to perform common checks without verbose conditionals and loops, enhancing code clarity and conciseness.</p><pre class="my-12"><code>const hasDiscountCodes = _.some(coupons, (coupon) =&gt; coupon.code === \'HOLIDAY2023\'); // true\n\nconst hasExpiredOffers = _.every(promotions, (offer) =&gt; offer.endDate &lt; new Date()); // false</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">6: Templating</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash simplifies string manipulation and templating tasks. Imagine generating personalized email greetings. The <code>_.template</code> function creates a reusable template that dynamically inserts values based on provided data, eliminating the need for manual string concatenation and error-prone logic.</p><pre class="my-12"><code>const template = `Dear ${_.capitalize(firstName)},`;\nconst greeting = _.template(template)({ firstName: \'John\' }); // Dear John,\n\nconst anotherGreeting = _.template(template)({ firstName: \'Mary\' }); // Dear Mary,</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">7: Currying</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash empowers developers to create custom functions with predefined arguments through currying. Consider a function that logs server requests with a timestamp. <code>_.curry</code> partially applies the <code>logRequest</code> function with the message, creating a new function specific to logging a particular type of request. This promotes code reuse and improves clarity.</p><pre class="my-12"><code>const logRequest = _.curry((message, request) =&gt; console.log(`${new Date().toISOString()} - ${message} - ${request.url}`));\n\nconst logGetProducts = logRequest(\'Get products\');\nlogGetProducts({ url: \'/api/products\' }); // 2023-12-16T12:50:00Z - Get products - /api/products\n\nconst logCreateUser = logRequest(\'Create user\');\nlogCreateUser({ url: \'/api/users\' }); // 2023-12-16T12:50:00Z - Create user - /api/users</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">8: Memoization</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash optimizes performance by memoizing expensive function calls, caching their results for subsequent invocations with the same arguments. Imagine calculating the Fibonacci sequence. The <code>_.memoize</code> function wraps the <code>fibonacci</code> function, storing its results for reuse when the same input (n) is provided again. This significantly improves performance for repeated calculations.</p><pre class="my-12"><code>const fibonacci = _.memoize((n) =&gt; {\n  if (n &lt;= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n});\n\nconst fib5 = fibonacci(5); // 5\nconst fib5Again = fibonacci(5); // (cached result)\n\nconsole.log(fib5Again); // 5 (directly retrieved from cache)</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">9: Conditional Aliases</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash enables developers to define custom aliases for existing functions based on specific conditions. Consider a reusable function to check if a number is even or odd. Using <code>_.once</code>, we define <code>isEven</code> as a function that only gets evaluated once, caching its result for subsequent calls. <code>_.negate</code> allows us to easily create a complementary function, <code>isOdd</code>, based on the logic of <code>isEven</code>.</p><pre class="my-12"><code>const isEven = _.once((n) =&gt; n % 2 === 0);\nconst isOdd = _.negate(isEven);\n\nconst checkNumber1 = isEven(4); // true\nconst checkNumber2 = isOdd(5); // true\n\nconsole.log(isEven(4)); // (cached result)</code></pre><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2"><strong class="font-bold text-gray-200">10: Functional Composition Chains</strong></p><p class="text-gray-200 tracking-wider subpixel-antialiased leading-relaxed text-[18px] mb-2">Lodash encourages a functional programming style by enabling seamless chaining of multiple function calls. Imagine transforming user data before saving it. This use case utilizes <code>_.chain</code> to create a fluent chain of function calls. <code>_.mapKeys</code> converts property names to camel case, <code>_.pick</code> selects specific properties, and finally, <code>_.value</code> retrieves the final transformed object.</p><pre class="my-12"><code>const user = { name: \'John Doe\', age: 30 };\n\nconst transformedUser = _.chain(user)\n  .mapKeys((value, key) =&gt; _.camelCase(key))\n  .pick([\'name\', \'age\'])\n  .value();\n\nconsole.log(transformedUser); // { name: \'johnDoe\', age: 30 }</code></pre>';

export default data;
