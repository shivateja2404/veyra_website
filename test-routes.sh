#!/bin/bash

# Route Testing Script
PORT=3003
BASE_URL="http://localhost:$PORT"

echo "================================"
echo "VEYRA SHARING ROUTES TEST"
echo "================================"
echo ""

# Test 1: Product Route
echo "1. Testing Product Route..."
echo "   URL: $BASE_URL/product/test-product-id"
RESPONSE=$(curl -s "$BASE_URL/product/test-product-id" | head -50)
if echo "$RESPONSE" | grep -q "og:image"; then
    echo "   ✅ Product route working"
    echo "$RESPONSE" | grep "og:image" | head -1
else
    echo "   ❌ Product route failed"
fi
echo ""

# Test 2: Post Route
echo "2. Testing Post Route..."
echo "   URL: $BASE_URL/post/test-post-id"
RESPONSE=$(curl -s "$BASE_URL/post/test-post-id" | head -50)
if echo "$RESPONSE" | grep -q "og:image"; then
    echo "   ✅ Post route working"
    echo "$RESPONSE" | grep "og:image" | head -1
else
    echo "   ❌ Post route failed"
fi
echo ""

# Test 3: Reel Route
echo "3. Testing Reel Route..."
echo "   URL: $BASE_URL/reel/test-reel-id"
RESPONSE=$(curl -s "$BASE_URL/reel/test-reel-id" | head -50)
if echo "$RESPONSE" | grep -q "og:image"; then
    echo "   ✅ Reel route working"
    echo "$RESPONSE" | grep "og:image" | head -1
else
    echo "   ❌ Reel route failed"
fi
echo ""

# Test 4: User Profile Route
echo "4. Testing User Profile Route..."
echo "   URL: $BASE_URL/user/test-user-id"
RESPONSE=$(curl -s "$BASE_URL/user/test-user-id" | head -50)
if echo "$RESPONSE" | grep -q "og:image"; then
    echo "   ✅ User route working"
    echo "$RESPONSE" | grep "og:image" | head -1
else
    echo "   ❌ User route failed"
fi
echo ""

# Test 5: Wardrobe Route
echo "5. Testing Wardrobe Route..."
echo "   URL: $BASE_URL/wardrobe/test-username"
RESPONSE=$(curl -s "$BASE_URL/wardrobe/test-username" | head -50)
if echo "$RESPONSE" | grep -q "og:image"; then
    echo "   ✅ Wardrobe route working"
    echo "$RESPONSE" | grep "og:image" | head -1
else
    echo "   ❌ Wardrobe route failed"
fi
echo ""

# Test 6: Referral Redirect
echo "6. Testing Referral Redirect..."
echo "   URL: $BASE_URL/r/test-code"
RESPONSE=$(curl -s -I "$BASE_URL/r/test-code" | grep -i location)
if [ ! -z "$RESPONSE" ]; then
    echo "   ✅ Referral redirect working"
    echo "   $RESPONSE"
else
    echo "   ⚠️  Referral redirect (404 expected if code doesn't exist)"
fi
echo ""

# Test 7: Wardrobe API
echo "7. Testing Wardrobe Collage API..."
echo "   URL: $BASE_URL/api/wardrobe-preview?username=test&format=json"
RESPONSE=$(curl -s "$BASE_URL/api/wardrobe-preview?username=test&format=json")
if echo "$RESPONSE" | grep -q "username"; then
    echo "   ✅ Wardrobe API working"
    echo "   $RESPONSE" | head -100
else
    echo "   ❌ Wardrobe API failed"
fi
echo ""

echo "================================"
echo "TEST COMPLETE"
echo "================================"
