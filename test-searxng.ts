
import { searchSearxng } from './src/lib/searxng';

async function test() {
    try {
        console.log('Testing searchSearxng with query "test"...');
        const result = await searchSearxng('test');

        if (result.results && result.results.length > 0) {
            console.log('✅ Search successful!');
            console.log(`Found ${result.results.length} results.`);
            console.log('First result token:', result.results[0].title);
        } else {
            console.log('❌ Search returned no results.');
            console.log('Result:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.error('❌ Search failed with error:', error);
    }
}

test();
