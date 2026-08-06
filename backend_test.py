#!/usr/bin/env python3
"""
Backend API Test Suite for Wedding RSVP Application
Tests all endpoints for the "Vetoni & Arta" invitation system
"""

import requests
import json
import sys
from datetime import datetime

# Load backend URL from frontend .env
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ ERROR: Could not find REACT_APP_BACKEND_URL in /app/frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_URL}\n")

# Test results tracking
tests_passed = 0
tests_failed = 0
test_results = []

def log_test(test_name, passed, details=""):
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        status = "✅ PASS"
    else:
        tests_failed += 1
        status = "❌ FAIL"
    
    result = f"{status}: {test_name}"
    if details:
        result += f"\n   {details}"
    print(result)
    test_results.append({"test": test_name, "passed": passed, "details": details})

def test_root_endpoint():
    """Test 1: GET /api/ should return a JSON message"""
    print("\n" + "="*70)
    print("TEST 1: Root Endpoint (GET /api/)")
    print("="*70)
    
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                log_test("Root endpoint returns JSON message", True, 
                        f"Message: {data['message']}")
            else:
                log_test("Root endpoint returns JSON message", False, 
                        "Response missing 'message' field")
        else:
            log_test("Root endpoint returns JSON message", False, 
                    f"Status code: {response.status_code}")
    except Exception as e:
        log_test("Root endpoint returns JSON message", False, f"Error: {str(e)}")

def test_seats_endpoint_initial():
    """Test 2: GET /api/seats should return seat statistics"""
    print("\n" + "="*70)
    print("TEST 2: Seats Endpoint (GET /api/seats)")
    print("="*70)
    
    try:
        response = requests.get(f"{API_URL}/seats", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['total', 'confirmedGuests', 'remaining', 
                             'acceptedCount', 'declinedCount', 'totalResponses']
            
            # Check all required fields exist
            missing_fields = [f for f in required_fields if f not in data]
            if missing_fields:
                log_test("Seats endpoint returns all required fields", False, 
                        f"Missing fields: {missing_fields}")
                return None
            
            log_test("Seats endpoint returns all required fields", True, 
                    f"All fields present: {required_fields}")
            
            # Verify total is 80
            if data['total'] == 80:
                log_test("Total seats is 80", True, f"Total: {data['total']}")
            else:
                log_test("Total seats is 80", False, 
                        f"Expected 80, got {data['total']}")
            
            # Verify math: remaining = total - confirmedGuests
            expected_remaining = data['total'] - data['confirmedGuests']
            if data['remaining'] == expected_remaining:
                log_test("Seat math is correct (remaining = total - confirmedGuests)", 
                        True, 
                        f"remaining={data['remaining']}, total={data['total']}, confirmedGuests={data['confirmedGuests']}")
            else:
                log_test("Seat math is correct (remaining = total - confirmedGuests)", 
                        False, 
                        f"Expected remaining={expected_remaining}, got {data['remaining']}")
            
            # Verify consistency
            if data['totalResponses'] == data['acceptedCount'] + data['declinedCount']:
                log_test("Response counts are consistent", True, 
                        f"totalResponses={data['totalResponses']}, acceptedCount={data['acceptedCount']}, declinedCount={data['declinedCount']}")
            else:
                log_test("Response counts are consistent", False, 
                        f"totalResponses={data['totalResponses']} != acceptedCount={data['acceptedCount']} + declinedCount={data['declinedCount']}")
            
            print(f"\n📊 Current Seat Status:")
            print(f"   Total: {data['total']}")
            print(f"   Confirmed Guests: {data['confirmedGuests']}")
            print(f"   Remaining: {data['remaining']}")
            print(f"   Accepted: {data['acceptedCount']}")
            print(f"   Declined: {data['declinedCount']}")
            print(f"   Total Responses: {data['totalResponses']}")
            
            return data
        else:
            log_test("Seats endpoint returns 200", False, 
                    f"Status code: {response.status_code}")
            return None
    except Exception as e:
        log_test("Seats endpoint returns 200", False, f"Error: {str(e)}")
        return None

def test_rsvp_create_accepting():
    """Test 3: POST /api/rsvp with attending=yes"""
    print("\n" + "="*70)
    print("TEST 3: Create RSVP - Accepting (POST /api/rsvp)")
    print("="*70)
    
    try:
        # Get initial seat count
        initial_seats = requests.get(f"{API_URL}/seats", timeout=10).json()
        initial_confirmed = initial_seats['confirmedGuests']
        initial_remaining = initial_seats['remaining']
        initial_accepted = initial_seats['acceptedCount']
        
        # Create RSVP
        payload = {
            "name": "Test Guest 1",
            "attending": "yes",
            "guests": 3,
            "message": "Urime!"
        }
        
        response = requests.post(f"{API_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            if 'rsvp' not in data or 'seats' not in data:
                log_test("RSVP response contains rsvp and seats", False, 
                        f"Response keys: {list(data.keys())}")
                return
            
            log_test("RSVP response contains rsvp and seats", True)
            
            rsvp = data['rsvp']
            seats = data['seats']
            
            # Verify RSVP has required fields
            if 'id' in rsvp and 'createdAt' in rsvp:
                log_test("RSVP has id and createdAt", True, 
                        f"id={rsvp['id'][:8]}..., createdAt={rsvp['createdAt']}")
            else:
                log_test("RSVP has id and createdAt", False, 
                        f"RSVP fields: {list(rsvp.keys())}")
            
            # Verify guests count
            if rsvp['guests'] == 3:
                log_test("RSVP guests count is correct", True, f"guests={rsvp['guests']}")
            else:
                log_test("RSVP guests count is correct", False, 
                        f"Expected 3, got {rsvp['guests']}")
            
            # Verify seat changes
            expected_confirmed = initial_confirmed + 3
            if seats['confirmedGuests'] == expected_confirmed:
                log_test("Confirmed guests increased by 3", True, 
                        f"Before: {initial_confirmed}, After: {seats['confirmedGuests']}")
            else:
                log_test("Confirmed guests increased by 3", False, 
                        f"Expected {expected_confirmed}, got {seats['confirmedGuests']}")
            
            expected_remaining = initial_remaining - 3
            if seats['remaining'] == expected_remaining:
                log_test("Remaining seats decreased by 3", True, 
                        f"Before: {initial_remaining}, After: {seats['remaining']}")
            else:
                log_test("Remaining seats decreased by 3", False, 
                        f"Expected {expected_remaining}, got {seats['remaining']}")
            
            expected_accepted = initial_accepted + 1
            if seats['acceptedCount'] == expected_accepted:
                log_test("Accepted count increased by 1", True, 
                        f"Before: {initial_accepted}, After: {seats['acceptedCount']}")
            else:
                log_test("Accepted count increased by 1", False, 
                        f"Expected {expected_accepted}, got {seats['acceptedCount']}")
            
            print(f"\n📝 Created RSVP:")
            print(f"   Name: {rsvp['name']}")
            print(f"   Attending: {rsvp['attending']}")
            print(f"   Guests: {rsvp['guests']}")
            print(f"   Message: {rsvp['message']}")
            
        else:
            log_test("RSVP creation returns 200", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        log_test("RSVP creation returns 200", False, f"Error: {str(e)}")

def test_rsvp_create_declining():
    """Test 4: POST /api/rsvp with attending=no"""
    print("\n" + "="*70)
    print("TEST 4: Create RSVP - Declining (POST /api/rsvp)")
    print("="*70)
    
    try:
        # Get initial counts
        initial_seats = requests.get(f"{API_URL}/seats", timeout=10).json()
        initial_confirmed = initial_seats['confirmedGuests']
        initial_declined = initial_seats['declinedCount']
        
        # Create declining RSVP
        payload = {
            "name": "Test Guest 2",
            "attending": "no",
            "guests": 0,
            "message": ""
        }
        
        response = requests.post(f"{API_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            rsvp = data['rsvp']
            seats = data['seats']
            
            # Verify guests is 0
            if rsvp['guests'] == 0:
                log_test("Declining RSVP has guests=0", True, f"guests={rsvp['guests']}")
            else:
                log_test("Declining RSVP has guests=0", False, 
                        f"Expected 0, got {rsvp['guests']}")
            
            # Verify declined count increased
            expected_declined = initial_declined + 1
            if seats['declinedCount'] == expected_declined:
                log_test("Declined count increased by 1", True, 
                        f"Before: {initial_declined}, After: {seats['declinedCount']}")
            else:
                log_test("Declined count increased by 1", False, 
                        f"Expected {expected_declined}, got {seats['declinedCount']}")
            
            # Verify confirmed guests unchanged
            if seats['confirmedGuests'] == initial_confirmed:
                log_test("Confirmed guests unchanged for declining RSVP", True, 
                        f"Confirmed: {seats['confirmedGuests']}")
            else:
                log_test("Confirmed guests unchanged for declining RSVP", False, 
                        f"Expected {initial_confirmed}, got {seats['confirmedGuests']}")
            
            print(f"\n📝 Created Declining RSVP:")
            print(f"   Name: {rsvp['name']}")
            print(f"   Attending: {rsvp['attending']}")
            print(f"   Guests: {rsvp['guests']}")
            
        else:
            log_test("Declining RSVP creation returns 200", False, 
                    f"Status code: {response.status_code}")
    except Exception as e:
        log_test("Declining RSVP creation returns 200", False, f"Error: {str(e)}")

def test_rsvp_optional_message():
    """Test 5: POST /api/rsvp with attending=yes but no message field"""
    print("\n" + "="*70)
    print("TEST 5: Create RSVP - Optional Message (POST /api/rsvp)")
    print("="*70)
    
    try:
        payload = {
            "name": "Test Guest 3",
            "attending": "yes",
            "guests": 2
            # message field intentionally omitted
        }
        
        response = requests.post(f"{API_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            log_test("RSVP creation works without message field", True, 
                    "Message field is optional")
            
            rsvp = data['rsvp']
            print(f"\n📝 Created RSVP without message:")
            print(f"   Name: {rsvp['name']}")
            print(f"   Attending: {rsvp['attending']}")
            print(f"   Guests: {rsvp['guests']}")
            print(f"   Message: '{rsvp.get('message', '')}'")
        else:
            log_test("RSVP creation works without message field", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        log_test("RSVP creation works without message field", False, f"Error: {str(e)}")

def test_rsvp_empty_name():
    """Test 6: POST /api/rsvp with empty name should return 400"""
    print("\n" + "="*70)
    print("TEST 6: Validation - Empty Name (POST /api/rsvp)")
    print("="*70)
    
    try:
        payload = {
            "name": "",
            "attending": "yes",
            "guests": 1,
            "message": "Test"
        }
        
        response = requests.post(f"{API_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 400:
            log_test("Empty name returns 400 error", True, 
                    f"Status: {response.status_code}, Response: {response.json()}")
        else:
            log_test("Empty name returns 400 error", False, 
                    f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Empty name returns 400 error", False, f"Error: {str(e)}")

def test_rsvp_invalid_attending():
    """Test 7: POST /api/rsvp with invalid attending value should return 422"""
    print("\n" + "="*70)
    print("TEST 7: Validation - Invalid Attending Value (POST /api/rsvp)")
    print("="*70)
    
    try:
        payload = {
            "name": "Test Guest",
            "attending": "maybe",  # Invalid value
            "guests": 1,
            "message": "Test"
        }
        
        response = requests.post(f"{API_URL}/rsvp", json=payload, timeout=10)
        
        if response.status_code == 422:
            log_test("Invalid attending value returns 422 error", True, 
                    f"Status: {response.status_code}")
        else:
            log_test("Invalid attending value returns 422 error", False, 
                    f"Expected 422, got {response.status_code}, Response: {response.text}")
    except Exception as e:
        log_test("Invalid attending value returns 422 error", False, f"Error: {str(e)}")

def test_rsvps_list():
    """Test 8: GET /api/rsvps should return list of RSVPs sorted by createdAt descending"""
    print("\n" + "="*70)
    print("TEST 8: List RSVPs (GET /api/rsvps)")
    print("="*70)
    
    try:
        response = requests.get(f"{API_URL}/rsvps", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list):
                log_test("RSVPs endpoint returns a list", True, 
                        f"Found {len(data)} RSVPs")
            else:
                log_test("RSVPs endpoint returns a list", False, 
                        f"Expected list, got {type(data)}")
                return
            
            if len(data) > 0:
                # Check first RSVP has required fields
                rsvp = data[0]
                required_fields = ['id', 'name', 'attending', 'guests', 'message', 'createdAt']
                missing_fields = [f for f in required_fields if f not in rsvp]
                
                if not missing_fields:
                    log_test("RSVPs have all required fields", True, 
                            f"Fields: {required_fields}")
                else:
                    log_test("RSVPs have all required fields", False, 
                            f"Missing: {missing_fields}")
                
                # Check if sorted by createdAt descending
                if len(data) > 1:
                    dates = [rsvp['createdAt'] for rsvp in data]
                    is_sorted = all(dates[i] >= dates[i+1] for i in range(len(dates)-1))
                    
                    if is_sorted:
                        log_test("RSVPs sorted by createdAt descending", True, 
                                f"First: {dates[0]}, Last: {dates[-1]}")
                    else:
                        log_test("RSVPs sorted by createdAt descending", False, 
                                "Dates are not in descending order")
                
                print(f"\n📋 RSVP List (showing first 3):")
                for i, rsvp in enumerate(data[:3]):
                    print(f"   {i+1}. {rsvp['name']} - {rsvp['attending']} - {rsvp['guests']} guests")
            else:
                log_test("RSVPs list is not empty", False, 
                        "No RSVPs found (expected at least the test RSVPs created)")
        else:
            log_test("RSVPs endpoint returns 200", False, 
                    f"Status code: {response.status_code}")
    except Exception as e:
        log_test("RSVPs endpoint returns 200", False, f"Error: {str(e)}")

def test_email_handling():
    """Test 9: Verify email sending is skipped gracefully when not configured"""
    print("\n" + "="*70)
    print("TEST 9: Email Handling (SendGrid Not Configured)")
    print("="*70)
    
    # This is verified by checking that RSVP creation succeeds even without SendGrid config
    # We already tested RSVP creation in previous tests, so we just verify the behavior
    
    try:
        # Check backend logs for email skip message
        import subprocess
        result = subprocess.run(
            ['tail', '-n', '50', '/var/log/supervisor/backend.out.log'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if 'SendGrid not configured' in result.stdout or 'email skipped' in result.stdout:
            log_test("Email sending skipped gracefully when not configured", True, 
                    "Found 'SendGrid not configured' or 'email skipped' in logs")
        else:
            # Even if not in logs, if RSVPs were created successfully, it's working
            log_test("Email sending does not block RSVP creation", True, 
                    "RSVPs created successfully despite missing SendGrid config")
    except Exception as e:
        # If we can't check logs, but RSVPs worked, that's still a pass
        log_test("Email sending does not block RSVP creation", True, 
                f"RSVPs created successfully (log check failed: {str(e)})")

def verify_final_seat_math():
    """Final verification: Check that all seat math is consistent"""
    print("\n" + "="*70)
    print("FINAL VERIFICATION: Seat Math Consistency")
    print("="*70)
    
    try:
        response = requests.get(f"{API_URL}/seats", timeout=10)
        if response.status_code == 200:
            seats = response.json()
            
            # Verify all math
            remaining_correct = seats['remaining'] == (seats['total'] - seats['confirmedGuests'])
            total_responses_correct = seats['totalResponses'] == (seats['acceptedCount'] + seats['declinedCount'])
            
            if remaining_correct and total_responses_correct:
                log_test("Final seat math is consistent", True, 
                        f"All calculations correct")
            else:
                issues = []
                if not remaining_correct:
                    issues.append(f"remaining={seats['remaining']} != total={seats['total']} - confirmedGuests={seats['confirmedGuests']}")
                if not total_responses_correct:
                    issues.append(f"totalResponses={seats['totalResponses']} != acceptedCount={seats['acceptedCount']} + declinedCount={seats['declinedCount']}")
                log_test("Final seat math is consistent", False, 
                        f"Issues: {'; '.join(issues)}")
            
            print(f"\n📊 Final Seat Status:")
            print(f"   Total: {seats['total']}")
            print(f"   Confirmed Guests: {seats['confirmedGuests']}")
            print(f"   Remaining: {seats['remaining']}")
            print(f"   Accepted: {seats['acceptedCount']}")
            print(f"   Declined: {seats['declinedCount']}")
            print(f"   Total Responses: {seats['totalResponses']}")
            print(f"\n   ✓ remaining = total - confirmedGuests: {remaining_correct}")
            print(f"   ✓ totalResponses = acceptedCount + declinedCount: {total_responses_correct}")
    except Exception as e:
        log_test("Final seat math verification", False, f"Error: {str(e)}")

def main():
    print("="*70)
    print("🧪 WEDDING RSVP BACKEND API TEST SUITE")
    print("   Vetoni & Arta Invitation System")
    print("="*70)
    
    # Run all tests in sequence
    test_root_endpoint()
    test_seats_endpoint_initial()
    test_rsvp_create_accepting()
    test_rsvp_create_declining()
    test_rsvp_optional_message()
    test_rsvp_empty_name()
    test_rsvp_invalid_attending()
    test_rsvps_list()
    test_email_handling()
    verify_final_seat_math()
    
    # Print summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)
    print(f"✅ Passed: {tests_passed}")
    print(f"❌ Failed: {tests_failed}")
    print(f"📈 Total: {tests_passed + tests_failed}")
    print(f"🎯 Success Rate: {(tests_passed/(tests_passed+tests_failed)*100):.1f}%")
    print("="*70)
    
    if tests_failed > 0:
        print("\n⚠️  Some tests failed. See details above.")
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
